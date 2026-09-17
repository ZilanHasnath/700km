import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/Product';

export async function GET() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI as string);
        }

        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .limit(8);

        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to fetch new arrivals' }, { status: 500 });
    }
}