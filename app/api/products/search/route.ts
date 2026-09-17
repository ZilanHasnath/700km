import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json({ message: 'Category parameter is required' }, { status: 400 });
        }

        await connectMongoDB();

        const products = await Product.find({
            category: { $regex: new RegExp(`^${category}$`, 'i') },
        });

        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        console.error('Category search API error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}