'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState('Changed my mind');

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const submitCancellation = async (orderId: string) => {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Cancelled', cancellationReason: selectedReason }),
        });

        if (res.ok) {
            setCancellingOrderId(null);
            fetchOrders();
        } else {
            const data = await res.json();
            alert(data.message || 'Order cannot be cancelled');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20 sm:pt-0 px-4">
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white">My Orders</h1>
                    <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">Track and manage your order history</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white/5 border border-white/20 rounded-3xl p-12 text-center backdrop-blur-2xl shadow-2xl">
                        <p className="text-sm font-bold text-white/60 mb-6">No orders found.</p>
                        <Link
                            href="/products"
                            className="inline-block bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="bg-white/5 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/20">
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">Order ID</p>
                                        <p className="text-sm font-mono text-white/80 mt-0.5 break-all">{order._id}</p>
                                    </div>
                                    <span className={`inline-block w-fit px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full backdrop-blur-md ${order.status === 'Cancelled' ? 'bg-red-500/10 border border-red-500/40 text-red-400' : 'bg-amber-400/10 border border-amber-400/40 text-amber-400'}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-black">Items</p>
                                    {order.orderItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm font-medium bg-white/5 p-3 rounded-2xl border border-white/15">
                                            <span className="text-white">{item.name} <span className="text-cyan-400 font-bold">x {item.quantity}</span></span>
                                            <span className="text-white/80 font-mono">BDT {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/20 pt-6 space-y-2 text-sm text-white/60 font-medium">
                                    <div className="flex justify-between">
                                        <span>Items Subtotal:</span>
                                        <span className="font-mono text-white">BDT {order.itemsPrice?.toFixed(2) ?? '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span className="font-mono text-white">BDT {order.taxPrice?.toFixed(2) ?? '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charge:</span>
                                        <span className="font-mono text-white">BDT {order.shippingPrice?.toFixed(2) ?? '0.00'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/20 pt-6 gap-4">
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">Total Amount</p>
                                        <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-0.5">BDT {order.totalPrice?.toFixed(2)}</p>
                                    </div>

                                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                        <div>
                                            {cancellingOrderId === order._id ? (
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                    <select
                                                        value={selectedReason}
                                                        onChange={(e) => setSelectedReason(e.target.value)}
                                                        className="bg-zinc-900 border border-white/30 text-white text-xs font-bold px-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-400"
                                                    >
                                                        <option value="Changed my mind">Changed my mind</option>
                                                        <option value="Found a better price">Found a better price</option>
                                                        <option value="Ordered by mistake">Ordered by mistake</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => submitCancellation(order._id)}
                                                            className="flex-1 sm:flex-none bg-red-600 border border-red-500 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-red-500 transition shadow-lg shadow-red-600/30"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setCancellingOrderId(null)}
                                                            className="flex-1 sm:flex-none bg-white/10 border border-white/30 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-white/20 transition"
                                                        >
                                                            Back
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setCancellingOrderId(order._id)}
                                                    className="w-full sm:w-auto bg-red-600 border border-red-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-red-500 transition shadow-lg shadow-red-600/30"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {order.cancellationReason && (
                                    <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-2xl backdrop-blur-md">
                                        <p className="text-xs font-bold text-red-400">Cancellation Reason: <span className="font-normal text-white/80">{order.cancellationReason}</span></p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}