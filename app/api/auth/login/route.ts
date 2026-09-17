import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import Cart from '@/models/Cart';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const localCartCookie = req.cookies.get('localCart')?.value;

        if (localCartCookie) {
            try {
                const localCartItems = JSON.parse(localCartCookie);
                let userCart = await Cart.findOne({ user: user._id });

                if (!userCart) {
                    userCart = await Cart.create({
                        user: user._id,
                        cartItems: localCartItems,
                    });
                } else {
                    for (const localItem of localCartItems) {
                        const existingIndex = userCart.cartItems.findIndex(
                            (item: any) => item.product.toString() === localItem.product
                        );

                        if (existingIndex > -1) {
                            userCart.cartItems[existingIndex].quantity += localItem.quantity;
                        } else {
                            userCart.cartItems.push(localItem);
                        }
                    }
                    await userCart.save();
                }
            } catch (cartError) {
                console.error('Cart merge error during login:', cartError);
            }
        }

        const response = NextResponse.json({ 
            message: 'Logged in successfully', 
            role: user.role 
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
        });

        response.cookies.set('localCart', '', { maxAge: 0, path: '/' });

        return response;
    } catch (error: any) {
        console.error('Login API error:', error);
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}