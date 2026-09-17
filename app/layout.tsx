import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
};

export const metadata: Metadata = {
    metadataBase: new URL("https://zilanhasnathlithon.vercel.app"),
    title: {
        default: "700km helicopter | Premium Helicopter Marketplace",
        template: "%s | 700km-helicopter",
    },
    description: "Discover, compare, and purchase world class aircraft on 700km-helicopter, a premier aviation e-commerce marketplace built with Next.js and MongoDB by Zilan Hasnath Lithon.",
    keywords: [
        "700km-helicopter",
        "helicopter marketplace",
        "buy helicopter",
        "aviation ecommerce",
        "luxury aircraft for sale",
        "Zilan Hasnath Lithon",
        "Next.js Developer"
    ],
    authors: [{ name: "Zilan Hasnath Lithon", url: "https://zilanhasnathlithon.vercel.app/" }],
    creator: "Zilan Hasnath Lithon",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://700km-helicopter.vercel.app/",
        siteName: "700km-helicopter",
        title: "700km helicopter | Premium Helicopter Marketplace",
        description: "Explore and buy premier helicopters on 700km-helicopter.",
    },
    twitter: {
        card: "summary_large_image",
        title: "700km-helicopter | Helicopter Marketplace",
        description: "A premier aviation e-commerce marketplace built by Zilan Hasnath Lithon.",
        creator: "@ZilanHasnath",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "700km-helicopter",
        "url": "https://700km-helicopter.vercel.app/",
        "creator": {
            "@type": "Person",
            "name": "Zilan Hasnath Lithon",
            "url": "https://zilanhasnathlithon.vercel.app/",
            "sameAs": [
                "https://x.com/ZilanHasnath"
            ]
        }
    };

    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-ZH2WN3386E"
                    strategy="beforeInteractive"
                />
                <Script id="google-analytics" strategy="beforeInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-ZH2WN3386E');
                    `}
                </Script>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${inter.className} bg-gray-50 text-gray-900`}>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}