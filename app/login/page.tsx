'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                window.dispatchEvent(new Event('cartUpdated'));

                if (data.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }

                router.refresh();
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-24 relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -top-40 -left-40" />
            <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -bottom-40 -right-40" />

            <div className="w-full max-w-md bg-white/[0.02] border border-white/20 hover:border-cyan-500/40 transition-all duration-500 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white">Welcome Back</h1>
                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-4 rounded-2xl backdrop-blur-md shadow-lg">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full mb-6 bg-white border border-white/80 hover:border-cyan-400 hover:bg-white/95 text-black text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-[0.99]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.36 7.21 24 12 24z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.21 0 3.17 2.64 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-white/20" />
                    <span className="px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Or with email</span>
                    <div className="flex-grow border-t border-white/20" />
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-white/5 border border-white/30 hover:border-white/50 text-white text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-white/30"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-white/75">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-cyan-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/30 hover:border-white/50 text-white text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-white/30"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-400 text-black text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-cyan-300 transition-all shadow-[0_10px_30px_rgba(34,211,238,0.3)] disabled:opacity-50 active:scale-[0.99] mt-2"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/20 pt-6">
                    <p className="text-xs font-semibold text-white/50 mb-3">Don't have an account?</p>
                    <Link
                        href="/register"
                        className="block w-full border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400 text-cyan-300 text-xs font-black uppercase tracking-widest py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-[0.99]"
                    >
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
}