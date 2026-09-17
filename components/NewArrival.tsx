'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
}

export default function NewArrival() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const res = await fetch('/api/products/newarrival');
                const data = await res.json();
                if (res.ok) {
                    setProducts(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    useEffect(() => {
        if (products.length === 0 || isPaused) return;

        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollStep = () => {
            if (!isPaused && scrollContainer) {
                scrollContainer.scrollLeft += 1;
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                }
            }
        };

        const interval = setInterval(scrollStep, 25);
        return () => clearInterval(interval);
    }, [products, isPaused]);

    if (loading) {
        return (
            <section className="w-full bg-black py-20 px-6 md:px-16 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10 space-y-2">
                        <div className="h-8 w-64 bg-zinc-800 rounded-xl animate-pulse" />
                    </div>
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="min-w-[300px] h-[420px] bg-zinc-900/60 rounded-3xl animate-pulse shrink-0 border border-zinc-800/50" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    const displayProducts = [...products, ...products];

    return (
        <section className="w-full bg-black text-white py-20 px-6 md:px-16 select-none relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                            New <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">Arrivals</span>
                        </h2>
                    </div>
                </div>

                <div 
                    ref={scrollContainerRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 scroll-smooth"
                    style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    {displayProducts.map((product, index) => (
                        <Link
                            key={`${product._id}-${index}`}
                            href={`/products/${product._id}`}
                            className="min-w-[300px] max-w-[300px] bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col justify-between shrink-0 group cursor-pointer"
                        >
                            <div>
                                <div className="relative h-60 w-full bg-zinc-950 overflow-hidden">
                                    <img 
                                        src={product.images?.[0] || ''} 
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
                                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-white text-lg tracking-tight truncate group-hover:text-cyan-300 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mt-2">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-zinc-800/40 mt-2">
                                <div className="pt-4">
                                    <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-wider">Price</span>
                                    <span className="font-black text-xl text-white tracking-tight">
                                        BDT {product.price?.toLocaleString()}
                                    </span>
                                </div>
                                <span className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-cyan-400 group-hover:text-black text-zinc-300 flex items-center justify-center transition-all duration-300 shadow-md">
                                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}