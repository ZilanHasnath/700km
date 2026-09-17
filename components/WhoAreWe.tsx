'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function WhoAreWe() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const stats = [
        { label: 'Elite Deliveries', value: '150+' },
        { label: 'Airworthiness', value: '100%' },
        { label: 'Configurations', value: 'Bespoke' },
        { label: 'Support Tier', value: '24/7' },
    ];

    return (
        <section 
            ref={sectionRef} 
            className="w-full bg-black text-white py-15 px-6 md:px-16 select-none relative overflow-hidden border-b border-zinc-900/80"
        >
            <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    <div className="lg:col-span-6 space-y-8">
                        <h2 
                            className={`text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.05] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                                isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm'
                            }`}
                            style={{ transitionDelay: '150ms' }}
                        >
                            Engineering The Apex Of <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">Aerial Mobility</span>
                        </h2>

                        <p 
                            className={`text-zinc-400 text-sm md:text-base leading-relaxed font-normal transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                                isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-14 blur-sm'
                            }`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            We operate at the intersection of extreme aeronautical engineering and ultra-luxury customization. Sourcing top-tier rotorcraft from across the globe, we provide private collectors, enterprises, and aviators with uncompromising machines built for supreme performance.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                            {stats.map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className={`bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl hover:border-cyan-500/50 hover:bg-zinc-900/80 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform group ${
                                        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-16 blur-sm'
                                    }`}
                                    style={{ transitionDelay: `${450 + idx * 100}ms` }}
                                >
                                    <div className="text-xl font-black text-white group-hover:text-cyan-400 tracking-tight transition-colors">
                                        {stat.value}
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div 
                            className={`pt-2 flex items-center gap-4 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                                isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-sm'
                            }`}
                            style={{ transitionDelay: '850ms' }}
                        >
                            <Link
                                href="/products"
                                className="px-8.5 py-4 rounded-full bg-cyan-400 text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 active:scale-95 flex items-center gap-3 group"
                            >
                                <span>Browse The Fleet</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div 
                        className={`lg:col-span-6 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                            isVisible ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-16 scale-95 blur-sm'
                        }`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div className="grid grid-cols-2 gap-4 items-center relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-3xl blur-xl pointer-events-none" />

                            <div className="relative h-[380px] w-full rounded-3xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl group">
                                <img 
                                    src="https://images.pexels.com/photos/32115180/pexels-photo-32115180.jpeg?auto=compress&cs=tinysrgb&w=800&q=80" 
                                    alt="Aviation display showcase" 
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                                    Primary Fleet
                                </span>
                            </div>

                            <div className="relative h-[440px] w-full rounded-3xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl group -mt-8">
                                <img 
                                    src="https://images.pexels.com/photos/4558373/pexels-photo-4558373.jpeg?auto=compress&cs=tinysrgb&w=800&q=80" 
                                    alt="Vertical aircraft component showcase" 
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                                    Custom Avionics
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}