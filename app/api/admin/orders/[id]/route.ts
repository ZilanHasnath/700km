import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        const resolvedParams = await params;
        const orderId = resolvedParams.id;
        const { status, isDelivered } = await req.json();

        await connectMongoDB();
        const order = await Order.findById(orderId);

        if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        if (status) order.status = status;
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            order.deliveredAt = isDelivered ? new Date() : undefined;
        }

        await order.save();
        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}