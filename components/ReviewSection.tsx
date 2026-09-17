'use client';

import { useState } from 'react';

export default function ReviewSection({ product }: { product: any }) {
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const res = await fetch(`/api/products/${product._id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, comment }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            setMessage('Review added successfully!');
            setComment('');
            window.location.reload();
        } else {
            setMessage(data.message || 'Failed to add review');
        }
    };

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            {message && <p className="mb-4 text-sm font-medium text-blue-600">{message}</p>}

            {product.hasPurchased ? (
                <form onSubmit={submitReview} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Write a Review</h3>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Rating</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="border border-gray-300 bg-white p-3 rounded-xl w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border border-gray-300 bg-white p-3 rounded-xl w-full h-32 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            required
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-10">
                    You must purchase and pay for this product to leave a review.
                </p>
            )}

            {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
            ) : (
                <div className="space-y-6">
                    {product.reviews.map((review: any) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                                <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">★ {review.rating}</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}