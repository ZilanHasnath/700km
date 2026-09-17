import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectMongoDB } from '@/lib/mongodb';

export const verifyAdmin = async (req: NextRequest) => {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        await connectMongoDB();

        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'admin') return null;

        return user._id;
    } catch {
        return null;
    }
};