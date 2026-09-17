import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const getUserId = (req: NextRequest) => {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded.id;
    } catch {
        return null;
    }
};