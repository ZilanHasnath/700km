'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [_, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        fetch('/api/users/profile')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setAddress(data.address || '');
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        const res = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, address }),
        });

        if (res.ok) {
            setMessage('Profile updated successfully');
            setIsEditing(false);
        } else {
            setMessage('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account?')) return;

        const res = await fetch('/api/users/profile', {
            method: 'DELETE',
        });

        if (res.ok) {
            router.push('/login');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        startTransition(() => {
            router.push('/login');
            router.refresh();
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20 sm:pt-0 px-4">
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl pb-3 font-black tracking-tighter text-white">My Profile </h1>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-auto bg-blue-400 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:opacity-95 transition-all duration-300 shadow-[0_10px_30px_rgba(34,211,238,0.3)] hover:shadow-[0_15px_35px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="bg-white/5 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                    {message && (
                        <div className="bg-cyan-400/10 border border-cyan-400/40 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-xs font-bold text-cyan-400 text-center">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-widest font-black">Name</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                className={`w-full bg-zinc-900 border ${isEditing ? 'border-white/50 focus:border-cyan-400 text-white' : 'border-white/30 text-white/80 cursor-not-allowed'} text-sm font-medium px-4 py-3.5 rounded-2xl focus:outline-none transition`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-widest font-black">Email</label>
                            <input
                                type="email"
                                disabled={!isEditing}
                                className={`w-full bg-zinc-900 border ${isEditing ? 'border-white/50 focus:border-cyan-400 text-white' : 'border-white/30 text-white/80 cursor-not-allowed'} text-sm font-medium px-4 py-3.5 rounded-2xl focus:outline-none transition`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/40 uppercase tracking-widest font-black">Delivery Address</label>
                            <textarea
                                disabled={!isEditing}
                                className={`w-full bg-zinc-900 border ${isEditing ? 'border-white/50 focus:border-cyan-400 text-white' : 'border-white/30 text-white/80 cursor-not-allowed'} text-sm font-medium p-4 rounded-2xl focus:outline-none h-28 resize-none transition`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        {isEditing && (
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-cyan-400 text-black text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white/10 border border-white/30 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-white/20 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="border-t border-white/20 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="w-full bg-red-600 border border-red-500 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-red-500 transition shadow-lg shadow-red-600/30"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="border-t border-white/20 pt-6">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:opacity-90 transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}