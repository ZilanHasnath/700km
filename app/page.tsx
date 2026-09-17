import { connectMongoDB } from '@/lib/mongodb';
import Hero from '@/components/Hero';
import NewArrival from '@/components/NewArrival';
import ProductsPage from '@/app/products/page';
import WhoAreWe from '@/components/WhoAreWe';
import HelicopterPremium from '@/components/HelicopterPremium';

export default async function Home() {
    await connectMongoDB();

    return (
        <div className="min-h-[calc(100vh-73px)] bg-black text-white">
            <Hero />
            <HelicopterPremium/>
            <NewArrival />
            <WhoAreWe />
            <ProductsPage />
        </div>
    );
}