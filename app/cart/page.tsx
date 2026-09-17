'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const res = await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        if (res.ok) {
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const removeItem = async (productId: string) => {
        const res = await fetch(`/api/cart?productId=${productId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20 sm:pt-0 px-4">
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">Loading cart...</p>
            </div>
        );
    }

    const items = cart?.items || [];

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black tracking-tighter text-white">Shopping Cart</h1>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">Review your selected items</p>
                    </div>
                    <div className="bg-white/5 border border-white/20 rounded-3xl p-12 text-center backdrop-blur-2xl shadow-2xl">
                        <p className="text-sm font-bold text-white/60 mb-6">Your cart is empty.</p>
                        <Link
                            href="/products"
                            className="inline-block bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
                        >
                            Explore Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalPrice = items.reduce((acc: number, item: any) => acc + (item.product?.price || 0) * item.quantity, 0);

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white">Shopping Cart</h1>
                    <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-2">Review your selected items</p>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                    <div className="divide-y divide-white/10 space-y-4">
                        {items.map((item: any, index: number) => {
                            const productId = item.product?._id;
                            return (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded-2xl bg-white/10 border border-white/15 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white text-sm tracking-tight truncate">{item.product?.name}</h3>
                                            <p className="text-xs text-white/60 font-semibold mt-0.5">BDT {item.product?.price?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                        <div className="flex items-center bg-white/10 border border-white/20 rounded-2xl overflow-hidden shrink-0">
                                            <button
                                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                                className="px-3 py-1.5 bg-transparent hover:bg-white/10 text-white font-bold text-sm transition"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1.5 text-xs font-bold text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                                className="px-3 py-1.5 bg-transparent hover:bg-white/10 text-white font-bold text-sm transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="font-mono font-black text-white text-sm sm:w-28 text-right shrink-0">
                                            BDT {((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </span>

                                        <button
                                            onClick={() => removeItem(productId)}
                                            className="bg-red-600 border border-red-500 text-white text-[11px] sm:text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-600/30 shrink-0"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/20 pt-6 gap-4">
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-black">Total Amount</p>
                            <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-0.5">BDT {totalPrice.toFixed(2)}</p>
                        </div>
                        <Link
                            href="/checkout"
                            className="w-full sm:w-auto text-center bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}