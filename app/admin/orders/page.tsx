'use client';

import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (res.ok) setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string, isDeliveredBool: boolean) => {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, isDelivered: isDeliveredBool }),
        });

        if (res.ok) {
            fetchOrders();
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to update order status');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading admin orders...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Customer Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 border-b pb-2 gap-2">
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Order ID: {order._id}</span>
                                    <p className="text-xs text-gray-500">
                                        Customer: <span className="font-medium text-gray-700">{order.user?.name || 'Unknown'}</span> ({order.user?.email || 'No email'})
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs rounded font-semibold ${order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {order.status || 'Processing'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-3 text-sm">
                                {order.orderItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>BDT {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-3 text-sm gap-4">
                                <div>
                                    <p className="text-gray-600">Subtotal: BDT {order.itemsPrice?.toFixed(2)} | Tax: ${order.taxPrice?.toFixed(2)} | Delivery: ${order.shippingPrice?.toFixed(2)}</p>
                                    <p className="font-bold text-base mt-1">Total: BDT {order.totalPrice?.toFixed(2)}</p>
                                    {order.cancellationReason && (
                                        <p className="text-xs text-red-500 mt-1">Cancellation Reason: {order.cancellationReason}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <select
                                        value={order.status || 'Processing'}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const isDel = val === 'Delivered';
                                            updateOrderStatus(order._id, val, isDel);
                                        }}
                                        className="border text-sm p-1.5 rounded bg-white"
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}