import Hero from '@/components/Hero';
import HelicopterPremium from '@/components/HelicopterPremium';
import WhoAreWe from '@/components/WhoAreWe';
import ProductsPage from '@/app/products/page';

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-73px)] bg-black text-white">
            <Hero />
            <HelicopterPremium />
            <WhoAreWe />
            <ProductsPage />
        </div>
    );
}