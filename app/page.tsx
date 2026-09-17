import { Suspense } from 'react';
import Hero from '@/components/Hero';
import HelicopterPremium from '@/components/HelicopterPremium';
import NewArrival from '@/components/NewArrival';
import WhoAreWe from '@/components/WhoAreWe';
import ProductsPage from '@/app/products/page';

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-73px)] bg-black text-white">
            <Hero />
            <HelicopterPremium />

            <Suspense fallback={<div className="h-48 bg-zinc-900 animate-pulse" />}>
                <NewArrival />
            </Suspense>

            <WhoAreWe />

            <Suspense fallback={<div className="h-96 bg-zinc-900 animate-pulse" />}>
                <ProductsPage />
            </Suspense>
        </div>
    );
}