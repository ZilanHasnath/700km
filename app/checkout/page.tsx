'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        images?: string[];
    };
    quantity: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Stripe');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            if (res.ok) {
                setCartItems(data.items || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
    const shippingPrice = itemsPrice > 5000 ? 0 : 500;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const endpoint = paymentMethod === 'Stripe' ? '/api/checkout/stripe' : '/api/checkout';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Checkout failed');
            }

            window.dispatchEvent(new Event('cartUpdated'));

            if (paymentMethod === 'Stripe' && data.url) {
                window.location.href = data.url;
            } else {
                router.push(`/orders/${data._id}`);
            }
        } catch (err: any) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-zinc-400 font-medium tracking-wide bg-black pt-20 sm:pt-12 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading checkout...
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center bg-black pt-20 sm:pt-12">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 mb-4 border border-zinc-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-zinc-400 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium text-sm rounded-xl hover:bg-zinc-200 transition shadow-sm"
                >
                    Go back shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout</h1>
                    <p className="text-sm text-zinc-400 mt-1">Complete your shipping and payment details below</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-800">
                            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold border border-zinc-700">1</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition"
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition"
                                        placeholder="Dhaka"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition"
                                        placeholder="1212"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Country</label>
                                    <input
                                        type="text"
                                        required
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition"
                                        placeholder="Bangladesh"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-800">
                            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold border border-zinc-700">2</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'Stripe' ? 'border-white bg-zinc-800 ring-1 ring-white' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Stripe"
                                            checked={paymentMethod === 'Stripe'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-white bg-zinc-800 border-zinc-500 focus:ring-white accent-white"
                                        />
                                        <span className="font-semibold text-sm text-white">Stripe</span>
                                    </div>
                                    <span className="text-xs text-zinc-300 font-medium">Card / Online</span>
                                </label>

                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'CashOnDelivery' ? 'border-white bg-zinc-800 ring-1 ring-white' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="CashOnDelivery"
                                            checked={paymentMethod === 'CashOnDelivery'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-white bg-zinc-800 border-zinc-500 focus:ring-white accent-white"
                                        />
                                        <span className="font-semibold text-sm text-white">Cash on Delivery</span>
                                    </div>
                                    <span className="text-xs text-zinc-300 font-medium">COD</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-zinc-950 p-6 sm:p-8 rounded-2xl shadow-sm border border-zinc-800 sticky top-6">
                            <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>
                            
                            <div className="divide-y divide-zinc-900 max-h-72 overflow-y-auto mb-6 pr-1">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="py-3 flex justify-between items-center text-sm gap-4">
                                        <span className="text-zinc-400 line-clamp-1">
                                            {item.product.name} <span className="text-zinc-500 font-medium">x{item.quantity}</span>
                                        </span>
                                        <span className="font-semibold text-white flex-shrink-0">
                                            BDT {(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-zinc-900 pt-4 text-sm">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Items Subtotal</span>
                                    <span className="font-medium text-white">BDT {itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Estimated Tax (5%)</span>
                                    <span className="font-medium text-white">BDT {taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                    <span>Shipping Fee</span>
                                    <span className="font-medium text-white">
                                        {shippingPrice === 0 ? <span className="text-emerald-400 font-semibold">Free</span> : `BDT ${shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg border-t border-zinc-800 pt-4 text-white">
                                    <span>Total Amount</span>
                                    <span className="text-white">BDT {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-6 bg-white text-black py-3.5 px-4 rounded-xl font-semibold text-sm hover:bg-zinc-200 active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}