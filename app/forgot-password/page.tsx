'voter'
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white mb-2">Forgot Password</h1>
                    <p className="text-sm text-white/60">Enter your email address and we will send you a link to reset your password.</p>
                </div>

                {message && <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-sm">{message}</div>}
                {error && <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-4 rounded-2xl text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-400 transition placeholder-white/40"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-white text-black py-3.5 rounded-2xl font-black text-sm hover:bg-cyan-400 transition shadow-lg disabled:opacity-50"
                    >
                        {submitting ? 'Sending link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/login" className="text-xs font-bold text-white/60 hover:text-cyan-400 transition">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}