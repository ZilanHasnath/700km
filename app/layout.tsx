import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'E-Commerce App',
    description: 'Built with Next.js and MongoDB',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>

            </head>
            <body className={`${inter.className} bg-gray-50 text-gray-900`}>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}