import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectMongoDB();
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
}

export async function POST(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await connectMongoDB();

    const order = await Order.create({ ...body, user: userId });
    return NextResponse.json(order, { status: 201 });
}