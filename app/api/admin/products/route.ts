import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        await connectMongoDB();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        const body = await req.json();
        await connectMongoDB();

        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}