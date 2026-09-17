import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { getUserId } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectMongoDB();
        const product = await Product.findById(id).populate('reviews.user', 'name').lean();

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        let hasPurchased = false;
        const userId = getUserId(req);
        if (userId) {
            const order = await Order.findOne({
                user: userId,
                'orderItems.product': id,
                isPaid: true,
            });
            if (order) hasPurchased = true;
        }

        return NextResponse.json({ ...product, hasPurchased }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectMongoDB();
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

        if (!updatedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectMongoDB();
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product removed' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}