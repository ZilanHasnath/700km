import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        await connectMongoDB();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}