import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserId } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        await connectMongoDB();
        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        const { status, cancellationReason } = await req.json();
        await connectMongoDB();

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

        if (order.isDelivered || order.status === 'Delivered') {
            return NextResponse.json({ message: 'Cannot cancel a delivered order' }, { status: 400 });
        }

        if (order.status === 'Cancelled') {
            return NextResponse.json({ message: 'Order is already cancelled' }, { status: 400 });
        }

        if (status === 'Cancelled') {
            order.status = 'Cancelled';
            order.cancellationReason = cancellationReason || 'No reason provided';
            await order.save();
            return NextResponse.json(order, { status: 200 });
        }

        return NextResponse.json({ message: 'Invalid update request' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}