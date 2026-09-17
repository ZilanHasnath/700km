'use client';

import { useState } from 'react';

export default function ProductActions({ product }: { product: any }) {
    const [toast, setToast] = useState('');

    const addToCart = async () => {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product._id, quantity: 1 }),
        });

        if (res.ok) {
            window.dispatchEvent(new Event('cartUpdated'));
            setToast('Product added to cart successfully!');
            setTimeout(() => {
                setToast('');
            }, 3000);
        } else {
            setToast('Failed to add product to cart');
            setTimeout(() => {
                setToast('');
            }, 3000);
        }
    };

    return (
        <div className="relative">
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-[9px] font-bold  tracking-wider uppercase px-5 py-4 rounded-xl shadow-2xl border border-gray-800 transition-all animate-in fade-in slide-in-from-top-4 duration-200">
                    {toast}
                </div>
            )}

            <button
                onClick={addToCart}
                className="w-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-[0.99]"
            >
                Add to Cart
            </button>
        </div>
    );
}