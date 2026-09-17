'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative w-full h-screen bg-black text-white overflow-hidden select-none flex flex-col justify-between px-6 md:px-16 pt-2 sm:pt-4 lg:pt-28 pb-16 sm:pb-20">
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="https://res.cloudinary.com/e1fga7nr/video/upload/q_auto,f_auto/v1789574660/268041.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-4 sm:gap-10 my-auto">
                <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                    <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter uppercase leading-[0.9] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
                        EXPERIENCE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                            THE SKY
                        </span> <br />
                        WITHOUT COMPROMISE
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <Link
                            href="/products"
                            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-cyan-400 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            <span>Explore</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end pt-6 lg:pt-0">
                    <div className="w-[280px] h-[155px] sm:w-[340px] sm:h-[200px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/20 relative bg-black transition-transform duration-500 hover:scale-105">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                        >
                            <source src="https://res.cloudinary.com/e1fga7nr/video/upload/q_auto,f_auto/v1789574660/268041.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}