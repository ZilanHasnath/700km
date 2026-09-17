import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserId } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectMongoDB();
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}