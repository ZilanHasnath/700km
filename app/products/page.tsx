'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
}

const CATEGORIES = [
    'All',
    'Single-Rotor',
    'Tandem',
    'Coaxial',
    'Intermeshing',
    'Tiltrotor',
    'Compound',
    'Spare Parts',
    'Tools',
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory === 'All' 
                    ? '/api/products' 
                    : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
                
                const res = await fetch(url);
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

        fetchProducts();
    }, [selectedCategory]);

    return (
        <main className="w-full min-h-screen bg-black text-white py-28 px-4 sm:px-6 md:px-16 select-none relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">Fleet & Gear</span>
                    </h1>
                </div>

                <div className="relative mb-14">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10 md:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 md:hidden" />

                    <div 
                        className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none justify-start md:justify-center"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                        {CATEGORIES.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shrink-0 shadow-lg cursor-pointer ${
                                        isActive
                                            ? 'bg-cyan-400 text-black shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105 border border-cyan-300'
                                            : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800/80 hover:border-cyan-500/40 hover:text-white backdrop-blur-md'
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[420px] bg-zinc-900/60 rounded-3xl animate-pulse border border-zinc-800/50" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 text-zinc-500 uppercase tracking-widest text-xs font-bold bg-zinc-950/40 rounded-3xl border border-zinc-900">
                        No items found in this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <Link
                                key={product._id}
                                href={`/products/${product._id}`}
                                className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col justify-between group cursor-pointer"
                                style={{ animationDelay: `${index * 75}ms` }}
                            >
                                <div>
                                    <div className="relative h-64 w-full bg-zinc-950 overflow-hidden">
                                        <img 
                                            src={product.images?.[0] || ''} 
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
                                        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg">
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
                                    <span className="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-2 rounded-xl group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shadow-inner">
                                        View
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}