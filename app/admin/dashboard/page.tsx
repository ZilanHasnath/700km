'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        productsCount: 0,
        ordersCount: 0,
        usersCount: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    fetch('/api/admin/products'),
                    fetch('/api/admin/orders'),
                    fetch('/api/admin/users'),
                ]);

                const products = productsRes.ok ? await productsRes.json() : [];
                const orders = ordersRes.ok ? await ordersRes.json() : [];
                const users = usersRes.ok ? await usersRes.json() : [];

                const revenue = orders.reduce((acc: number, order: any) => {
                    return order.status !== 'Cancelled' ? acc + (order.totalPrice || 0) : acc;
                }, 0);

                setStats({
                    productsCount: products.length,
                    ordersCount: orders.length,
                    usersCount: users.length,
                    totalRevenue: revenue,
                });
            } catch (error) {
                console.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading admin dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-sm">
                    <h2 className="text-sm font-semibold text-blue-600 mb-1">Total Products</h2>
                    <p className="text-3xl font-bold text-blue-900">{stats.productsCount}</p>
                </div>

                <div className="bg-green-50 border border-green-200 p-5 rounded-lg shadow-sm">
                    <h2 className="text-sm font-semibold text-green-600 mb-1">Total Orders</h2>
                    <p className="text-3xl font-bold text-green-900">{stats.ordersCount}</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg shadow-sm">
                    <h2 className="text-sm font-semibold text-purple-600 mb-1">Total Users</h2>
                    <p className="text-3xl font-bold text-purple-900">{stats.usersCount}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg shadow-sm">
                    <h2 className="text-sm font-semibold text-yellow-600 mb-1">Total Revenue</h2>
                    <p className="text-3xl font-bold text-yellow-900">BDT {stats.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border p-6 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
                        <p className="text-sm text-gray-500 mb-4">Add, view, update, or remove store products.</p>
                    </div>
                    <Link
                        href="/admin/products"
                        className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                    >
                        Go to Products
                    </Link>
                </div>

                <div className="border p-6 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Manage Orders</h2>
                        <p className="text-sm text-gray-500 mb-4">Review customer orders and update delivery statuses.</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                    >
                        Go to Orders
                    </Link>
                </div>

                <div className="border p-6 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
                        <p className="text-sm text-gray-500 mb-4">View platform users, change roles, or remove accounts.</p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700 transition text-sm font-medium"
                    >
                        Go to Users
                    </Link>
                </div>
            </div>
        </div>
    );
}