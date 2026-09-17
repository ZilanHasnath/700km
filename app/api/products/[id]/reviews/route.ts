import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getUserId } from '@/lib/auth';
import User from '@/models/User';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectMongoDB();
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        const hasPurchased = await Order.findOne({
            user: userId,
            'orderItems.product': productId,
            isPaid: true,
        });

        if (!hasPurchased) {
            return NextResponse.json(
                { message: 'You must purchase this product before writing a review.' },
                { status: 403 }
            );
        }

        const { rating, comment } = await req.json();
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const alreadyReviewed = product.reviews.find(
            (r: any) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
        }

        const review = {
            user: userId,
            name: user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}