import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { shippingAddress, paymentMethod } = await req.json();

        if (!shippingAddress || !paymentMethod) {
            return NextResponse.json({ message: 'Shipping address and payment method are required' }, { status: 400 });
        }

        await connectMongoDB();

        const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return NextResponse.json({ message: 'Your cart is empty' }, { status: 400 });
        }

        let itemsPrice = 0;
        const orderItems = cart.cartItems.map((item: any) => {
            const product = item.product;
            if (!product) throw new Error('Product not found');
            itemsPrice += product.price * item.quantity;
            return {
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.images?.[0] || product.image || '',
            };
        });

        const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: false,
        });

        cart.cartItems = [];
        await cart.save();

        return NextResponse.json({ _id: order._id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}