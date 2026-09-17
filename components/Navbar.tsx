'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition, MouseEvent } from 'react';

export default function Navbar() {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const [role, setRole] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/users/profile', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setIsLoggedIn(true);
                        setRole(data.role);
                    }
                } else {
                    setIsLoggedIn(false);
                    setRole(null);
                }
            } catch {
                setIsLoggedIn(false);
                setRole(null);
            }
        };

        const fetchCartCount = async () => {
            try {
                const res = await fetch('/api/cart', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.items) {
                        const totalItems = data.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                        setCartCount(totalItems);
                    }
                }
            } catch {
                setCartCount(0);
            }
        };

        fetchUserData();
        fetchCartCount();

        const handleCartUpdate = () => {
            fetchCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [pathname]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSearchResults(data);
                    }
                } catch {
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsLoggedIn(false);
        setRole(null);
        setCartCount(0);
        startTransition(() => {
            router.push('/login');
            router.refresh();
        });
    };

    const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" onClick={scrollToTop} className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 group">
                        <span className="bg-white bg-clip-text text-transparent group-hover:to-cyan-400 transition">700km</span>
                    </Link>

                    <div className="relative w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            className="w-full bg-white/5 backdrop-blur-md border border-gray-400 text-white text-sm pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition placeholder-white/50 shadow-xl"
                        />
                        {isSearchOpen && searchQuery && (
                            <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 max-h-80 overflow-y-auto z-50 p-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-white">{product.name}</p>
                                                <p className="text-xs text-white/80">BDT {product.price}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-white/60 py-4">No products found</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/products" className="text-sm font-bold text-white hover:text-cyan-400 transition">
                            Products
                        </Link>
                        {role !== 'admin' && (
                            <Link href="/cart" className="text-sm font-bold text-white hover:text-cyan-400 transition relative flex items-center">
                                Cart
                                {cartCount > 0 && (
                                    <span className="ml-1.5 bg-cyan-400 text-black text-xs font-black px-2 py-0.5 rounded-full shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <>
                                {role === 'admin' ? (
                                    <Link href="/admin/dashboard" className="text-sm font-bold text-white hover:text-cyan-400 transition">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/orders" className="text-sm font-bold text-white hover:text-cyan-400 transition">
                                        Orders
                                    </Link>
                                )}
                                <Link href="/profile" className="text-sm font-bold text-white hover:text-cyan-400 transition">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    disabled={isPending}
                                    className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-bold px-5 py-2.5 rounded-2xl hover:bg-red-500/30 transition disabled:opacity-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-white text-black text-sm font-black px-6 py-3 rounded-2xl hover:bg-cyan-400 transition shadow-lg"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <header className={`md:hidden bg-black/50 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-40 px-5 h-16 flex justify-between items-center transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <Link href="/" onClick={scrollToTop} className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    700km
                </Link>
                {role !== 'admin' && (
                    <Link href="/cart" className="relative text-white p-2 bg-white/10 rounded-xl border border-white/10">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                )}
            </header>

            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 md:hidden flex flex-col p-4">
                    <div className="bg-black/90 border border-white/20 rounded-3xl p-4 shadow-2xl space-y-4 text-white">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-white text-base">Search Products</h2>
                            <button onClick={() => setIsSearchOpen(false)} className="text-sm font-bold text-white/70 hover:text-white">
                                Cancel
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full bg-white/10 border border-white/20 text-white text-sm px-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-400 placeholder-white/60"
                        />
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {searchResults.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/products/${product._id}`}
                                    onClick={() => setIsSearchOpen(false)}
                                    className="block p-3 hover:bg-white/10 rounded-2xl transition border border-white/10"
                                >
                                    <p className="text-sm font-bold text-white">{product.name}</p>
                                    <p className="text-xs text-white/80 font-semibold">BDT {product.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-1.5 left-4 right-4 bg-black/80 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl px-4 py-2.5 flex justify-between items-center md:hidden z-40">
                <Link href="/" onClick={scrollToTop} className="flex flex-col items-center gap-0.5 text-white hover:text-cyan-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="text-[10px] font-bold tracking-tight">Home</span>
                </Link>

                <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-white hover:text-cyan-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span className="text-[10px] font-bold tracking-tight">Search</span>
                </button>

                <Link href="/products" className="flex flex-col items-center gap-0.5 text-white hover:text-cyan-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span className="text-[10px] font-bold tracking-tight">Products</span>
                </Link>

                {role !== 'admin' && isLoggedIn && (
                    <Link href="/orders" className="flex flex-col items-center gap-0.5 text-white hover:text-cyan-400 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <span className="text-[10px] font-bold tracking-tight">Orders</span>
                    </Link>
                )}

                <Link href={isLoggedIn ? (role === 'admin' ? '/admin/dashboard' : '/profile') : '/login'} className="flex flex-col items-center gap-0.5 text-white hover:text-cyan-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-[10px] font-bold tracking-tight">{isLoggedIn ? 'Profile' : 'Login'}</span>
                </Link>
            </nav>
        </>
    );
}