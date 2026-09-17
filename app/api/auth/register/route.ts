import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import Cart from '@/models/Cart';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, address } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'All required fields must be filled' }, { status: 400 });
        }

        await connectMongoDB();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, address });

        const localCartCookie = req.cookies.get('localCart')?.value;

        if (localCartCookie) {
            try {
                const localCartItems = JSON.parse(localCartCookie);
                if (localCartItems.length > 0) {
                    await Cart.create({
                        user: newUser._id,
                        cartItems: localCartItems,
                    });
                }
            } catch (cartError) {
                console.error('Cart transfer error during registration:', cartError);
            }
        }

        const response = NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
        response.cookies.set('localCart', '', { maxAge: 0, path: '/' });

        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}