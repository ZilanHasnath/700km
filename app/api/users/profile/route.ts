import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectMongoDB();
    const user = await User.findById(userId).select('-password');
    return NextResponse.json(user, { status: 200 });
}

export async function PUT(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name, email, address } = await req.json();
    await connectMongoDB();

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, address },
        { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectMongoDB();
    await User.findByIdAndDelete(userId);

    const response = NextResponse.json({ message: 'Account deleted' }, { status: 200 });
    response.cookies.delete('token');
    return response;
}