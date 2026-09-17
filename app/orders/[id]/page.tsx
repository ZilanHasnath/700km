'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
    _id: string;
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
}

export default function OrderDetailsPage() {
    const params = useParams();
    const id = params?.id;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to load order');
            }
            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">Loading order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl text-center backdrop-blur-2xl shadow-2xl">
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-4 rounded-2xl mb-6 backdrop-blur-md">
                        {error || 'Order not found'}
                    </div>
                    <Link
                        href="/"
                        className="inline-block bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Order Details</h1>
                        <p className="text-xs text-white/60 font-mono mt-1">ID: {order._id}</p>
                    </div>
                    <Link
                        href="/orders"
                        className="inline-block bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-white/20 transition text-center"
                    >
                        &larr; Back to Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Shipping Information</h2>
                            <p className="text-sm text-white/80 font-medium leading-relaxed">
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <div className={`mt-4 p-4 rounded-2xl text-xs font-bold backdrop-blur-md border ${order.isDelivered ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                                {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt!).toLocaleString()}` : 'Not Delivered'}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Payment Information</h2>
                            <p className="text-sm text-white/80 font-medium">{order.paymentMethod}</p>
                            <div className={`mt-4 p-4 rounded-2xl text-xs font-bold backdrop-blur-md border ${order.isPaid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
                                {order.isPaid ? `Paid at ${new Date(order.paidAt!).toLocaleString()}` : 'Not Paid'}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Order Items</h2>
                            <div className="divide-y divide-white/10 space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-sm font-medium">
                                        <div className="flex items-center space-x-4">
                                            {item.image && (
                                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-bold">{item.name}</p>
                                                <p className="text-xs text-white/60 mt-0.5">Quantity: <span className="text-cyan-400 font-bold">{item.quantity}</span></p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-white/90">BDT {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl sticky top-28">
                            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Order Summary</h2>
                            <div className="space-y-3 text-sm text-white/70 font-medium">
                                <div className="flex justify-between">
                                    <span>Items Subtotal</span>
                                    <span className="font-mono text-white">BDT {order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span className="font-mono text-white">BDT {order.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-mono text-white">BDT {order.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-black text-lg text-white border-t border-white/10 pt-4 mt-4">
                                    <span>Total</span>
                                    <span className="font-mono text-cyan-400">BDT {order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}