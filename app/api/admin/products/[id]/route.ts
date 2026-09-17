import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        const resolvedParams = await params;
        const productId = resolvedParams.id;
        const body = await req.json();

        await connectMongoDB();
        const updatedProduct = await Product.findByIdAndUpdate(productId, body, { new: true });

        if (!updatedProduct) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        const resolvedParams = await params;
        const productId = resolvedParams.id;

        await connectMongoDB();
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}