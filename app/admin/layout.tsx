'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const navLinks = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Products', href: '/admin/products' },
        { name: 'Orders', href: '/admin/orders' },
        { name: 'Users', href: '/admin/users' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-gray-900 text-white flex-col justify-between hidden md:flex">
                <div>
                    <div className="p-6 border-b border-gray-800">
                        <h1 className="text-xl font-bold tracking-wide">Admin Portal</h1>
                        <p className="text-xs text-gray-400 mt-1">Store Management</p>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition text-center"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center md:hidden">
                    <span className="font-bold text-gray-800">Admin Portal</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white text-xs px-3 py-1.5 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}