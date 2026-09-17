import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            const localCartCookie = req.cookies.get('localCart')?.value;
            if (!localCartCookie) {
                return NextResponse.json({ items: [] }, { status: 200 });
            }

            const localCartItems = JSON.parse(localCartCookie);
            await connectMongoDB();

            const productIds = localCartItems.map((item: any) => item.product);
            const products = await Product.find({ _id: { $in: productIds } }).lean();

            const items = localCartItems.map((item: any) => {
                const product = products.find((p: any) => p._id.toString() === item.product);
                return {
                    product: product || null,
                    quantity: item.quantity,
                };
            }).filter((item: any) => item.product !== null);

            return NextResponse.json({ items }, { status: 200 });
        }

        await connectMongoDB();
        const cart = await Cart.findOne({ user: userId }).populate('cartItems.product').lean();

        if (!cart) {
            return NextResponse.json({ items: [] }, { status: 200 });
        }

        return NextResponse.json({ items: cart.cartItems || [] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const { productId, quantity } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        if (!userId) {
            const localCart = JSON.parse(req.cookies.get('localCart')?.value || '[]');
            const existingItem = localCart.find((item: any) => item.product === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.push({ product: productId, quantity });
            }

            const response = NextResponse.json({ message: 'Added to local cart' }, { status: 200 });
            response.cookies.set('localCart', JSON.stringify(localCart), { path: '/' });
            return response;
        }

        await connectMongoDB();
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                cartItems: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.cartItems.findIndex(
                (item: any) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.cartItems[itemIndex].quantity += quantity;
            } else {
                cart.cartItems.push({ product: productId, quantity });
            }

            await cart.save();
        }

        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const { productId, quantity } = await req.json();

        if (quantity <= 0) {
            return NextResponse.json({ message: 'Quantity must be greater than zero' }, { status: 400 });
        }

        if (!userId) {
            const localCart = JSON.parse(req.cookies.get('localCart')?.value || '[]');
            const existingItem = localCart.find((item: any) => item.product === productId);

            if (existingItem) {
                existingItem.quantity = quantity;
            }

            const response = NextResponse.json({ message: 'Cart updated' }, { status: 200 });
            response.cookies.set('localCart', JSON.stringify(localCart), { path: '/' });
            return response;
        }

        await connectMongoDB();
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        const itemIndex = cart.cartItems.findIndex(
            (item: any) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity = quantity;
            await cart.save();
        }

        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
        }

        if (!userId) {
            let localCart = JSON.parse(req.cookies.get('localCart')?.value || '[]');
            localCart = localCart.filter((item: any) => item.product !== productId);

            const response = NextResponse.json({ message: 'Item removed' }, { status: 200 });
            response.cookies.set('localCart', JSON.stringify(localCart), { path: '/' });
            return response;
        }

        await connectMongoDB();
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        cart.cartItems = cart.cartItems.filter((item: any) => item.product.toString() !== productId);
        await cart.save();

        return NextResponse.json(cart, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}