import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const adminId = await verifyAdmin(req);
        if (!adminId) return NextResponse.json({ message: 'Unauthorized / Forbidden' }, { status: 403 });

        const resolvedParams = await params;
        const userId = resolvedParams.id;
        const body = await req.json();

        await connectMongoDB();
        const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true }).select('-password');

        if (!updatedUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        return NextResponse.json(updatedUser, { status: 200 });
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
        const userId = resolvedParams.id;

        await connectMongoDB();
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}