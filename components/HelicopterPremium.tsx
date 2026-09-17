'use client';

import { useEffect, useRef, useState } from 'react';

export default function HelicopterPremium() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const clampedProgress = Math.min(Math.max(progress, 0), 1);
            setScrollProgress(clampedProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scaleEffect = 0.92 + scrollProgress * 0.08;
    const roundedEffect = 40 - scrollProgress * 20;

    return (
        <section 
            ref={sectionRef} 
            className="w-full bg-[#000000] text-[#f5f5f7] py-20 px-6 md:px-12 select-none relative overflow-hidden font-sans"
        >
            <div className="max-w-[1024px] mx-auto text-center space-y-3 mb-20">
                <h2 className={`text-4xl md:text-7xl font-semibold tracking-tight text-[#f5f5f7] leading-[1.08] transition-all duration-1000 delay-100 ease-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    A sanctuary above the clouds.
                </h2>
                <p className={`text-[#86868b] text-lg md:text-2xl font-normal max-w-2xl mx-auto tracking-tight pt-2 transition-all duration-1000 delay-200 ease-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                    Meticulously tailored from acoustic isolation down to the finest Italian stitch. Designed to silence the world entirely.
                </p>
            </div>

            <div className="max-w-[1300px] mx-auto">
                <div 
                    ref={imageContainerRef}
                    className={`relative w-full h-[550px] md:h-[800px] overflow-hidden bg-[#161617] border border-[#333336] shadow-2xl transition-all duration-700 ease-out ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ 
                        transform: `scale(${Math.min(Math.max(scaleEffect, 0.92), 1)})`,
                        borderRadius: `${Math.max(roundedEffect, 0)}px`
                    }}
                >
                    <img 
                        src="https://images.pexels.com/photos/38235998/pexels-photo-38235998.jpeg" 
                        alt="Helicopter luxury interior showcase" 
                        className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] transition-transform duration-1000 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-10 left-8 md:bottom-16 md:left-16 right-8 md:right-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
                        <div className="space-y-1 max-w-md">
                            <span className="text-[#86868b] text-xs font-bold tracking-widest uppercase">
                                Bespoke Craftsmanship
                            </span>
                            <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
                                Hand-stitched full-grain leather cabin.
                            </h3>
                        </div>

                        <div className="bg-[#1d1d1f]/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-2xl pointer-events-auto">
                            <div>
                                <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">Cabin Silence</span>
                                <span className="text-xl md:text-2xl font-semibold text-white tracking-tight">Ultra-Acoustic</span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10" />
                            <div>
                                <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">Climate</span>
                                <span className="text-xl md:text-2xl font-semibold text-white tracking-tight">Dual-Zone</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`max-w-[1024px] mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left transition-all duration-1000 delay-300 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            }`}>
                <div className="space-y-2 border-l-0 md:border-l border-[#333336] md:pl-6">
                    <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight block">0 dB</span>
                    <h4 className="text-sm font-semibold text-[#f5f5f7]">Active Noise Cancellation</h4>
                    <p className="text-xs text-[#86868b] leading-relaxed">Advanced harmonic dampening creates complete silence for executive focus.</p>
                </div>
                <div className="space-y-2 border-l-0 md:border-l border-[#333336] md:pl-6">
                    <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight block">100%</span>
                    <h4 className="text-sm font-semibold text-[#f5f5f7]">Custom Configuration</h4>
                    <p className="text-xs text-[#86868b] leading-relaxed">Every seating arrangement and finish is chosen exclusively by you.</p>
                </div>
                <div className="space-y-2 border-l-0 md:border-l border-[#333336] md:pl-6">
                    <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight block">Glass</span>
                    <h4 className="text-sm font-semibold text-[#f5f5f7]">Synthetic Flight Deck</h4>
                    <p className="text-xs text-[#86868b] leading-relaxed">Intuitive touchscreen avionics built for precision navigation worldwide.</p>
                </div>
            </div>
        </section>
    );
}