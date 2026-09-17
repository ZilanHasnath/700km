import Link from 'next/link';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectMongoDB } from '@/lib/mongodb';
import '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import ProductActions from '@/components/ProductActions';
import ReviewSection from '@/components/ReviewSection';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await connectMongoDB();
    const product = await Product.findById(id).populate('reviews.user', 'name').lean();

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl flex items-center justify-center mb-6 text-2xl font-black shadow-2xl backdrop-blur-xl">!</div>
                <p className="text-2xl font-black tracking-tight text-white">Product not found</p>
                <p className="text-sm text-white/60 mt-2 max-w-sm">The product you are looking for might have been removed or is temporarily unavailable.</p>
                <Link href="/" className="mt-8 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition shadow-2xl active:scale-[0.98]">
                    Back to Home
                </Link>
            </div>
        );
    }

    let hasPurchased = false;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const order = await Order.findOne({
                user: decoded.id,
                'orderItems.product': id,
                isPaid: true,
            });
            if (order) hasPurchased = true;
        } catch {
        }
    }

    const serializedProduct = {
        ...product,
        _id: product._id.toString(),
        hasPurchased,
        reviews: product.reviews.map((r: any) => ({
            ...r,
            _id: r._id.toString(),
            user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
        })),
    };

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-cyan-400 selection:text-black">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        {product.images && product.images.length > 1 && (
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
                                {product.images.map((img: string, idx: number) => (
                                    <div key={idx} className="w-20 h-24 sm:w-24 sm:h-28 bg-zinc-900/80 border border-white/30 flex-shrink-0 overflow-hidden cursor-pointer rounded-2xl group shadow-2xl backdrop-blur-md transition hover:border-cyan-400">
                                        <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="w-full h-[420px] sm:h-[520px] lg:h-[650px] bg-zinc-900/50 border border-white/30 overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group backdrop-blur-2xl">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-xs font-black uppercase tracking-widest text-white/40">
                                    No Image Available
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col space-y-8 lg:sticky lg:top-28">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 bg-cyan-400/10 border border-cyan-400/40 text-cyan-400 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                {product.category || 'Exclusive Collection'}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                                BDT {product.price?.toLocaleString()}
                            </p>
                        </div>

                        <div className="border-t border-b border-white/20 py-6">
                            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 bg-zinc-900/80 border border-white/30 p-4 rounded-2xl backdrop-blur-xl shadow-lg">
                            <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`}></span>
                            <p className="text-xs font-bold tracking-widest uppercase text-white/70">
                                Availability: <span className="text-white font-black">{product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}</span>
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <ProductActions product={serializedProduct} />
                            <Link
                                href={`/checkout?productId=${product._id}`}
                                className="w-full block text-center bg-white text-black text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-cyan-300 transition shadow-[0_10px_30px_rgba(34,211,238,0.3)] active:scale-[0.99]"
                            >
                                Buy Now Instantly
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-16">
                    <ReviewSection product={serializedProduct} />
                </div>
            </div>
        </div>
    );
}