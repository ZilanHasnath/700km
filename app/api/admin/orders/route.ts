import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        await connectMongoDB();
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}