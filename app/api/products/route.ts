import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getUserId } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get('keyword');
        const category = searchParams.get('category');

        const query: any = {};
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectMongoDB();
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const product = await Product.create(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}