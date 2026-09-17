import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let query = searchParams.get('q')?.trim() || '';
        const category = searchParams.get('category');

        if (!query && !category) {
            return NextResponse.json({ message: 'Search query or category parameter is required' }, { status: 400 });
        }

        await connectMongoDB();

        const filter: any = {};

        if (query) {
            if (query.toLowerCase() === 'nobile') {
                query = 'mobile';
            }

            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ];
        }

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        let products = await Product.find(filter);

        if (products.length === 0 && query.length > 3) {
            const looseQuery = query.replace(/^n/i, 'm'); // e.g., nobile -> mobile
            filter.$or = [
                { name: { $regex: looseQuery, $options: 'i' } },
                { description: { $regex: looseQuery, $options: 'i' } },
            ];
            products = await Product.find(filter);
        }

        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        console.error('Search API error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}