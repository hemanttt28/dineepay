"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Smartphone, AlertCircle } from "lucide-react";

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    items: string; // JSON string
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        // Poll for new orders every 30s
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "PREPARING": return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Active Orders</h1>
                    <p className="text-gray-500">Manage incoming orders in real-time.</p>
                </div>
                <button onClick={fetchOrders} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => {
                    const items = JSON.parse(order.items || "[]");

                    return (
                        <div key={order.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    {new Date(order.createdAt).toLocaleString()}
                                </div>

                                <div className="space-y-2">
                                    {/* Items List */}
                                    {Array.isArray(items) ? items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-900 dark:text-white">{item.quantity}x {item.name}</span>
                                            {/* <span className="text-gray-500">₹{item.price}</span> */}
                                        </div>
                                    )) : <p className="text-red-500">Invalid Item Data</p>}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-500">Total Amount</span>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">₹{order.totalAmount}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 justify-center border-l border-gray-100 dark:border-zinc-800 pl-6 md:w-48">
                                <button
                                    onClick={() => updateStatus(order.id, "PREPARING")}
                                    disabled={order.status !== "PENDING"}
                                    className="w-full py-2 px-4 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 disabled:opacity-50 transition-colors text-sm"
                                >
                                    Start Preparing
                                </button>
                                <button
                                    onClick={() => updateStatus(order.id, "COMPLETED")}
                                    disabled={order.status === "COMPLETED"}
                                    className="w-full py-2 px-4 bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-100 disabled:opacity-50 transition-colors text-sm"
                                >
                                    Mark Complete
                                </button>
                            </div>
                        </div>
                    )
                })}
                {orders.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        No active orders right now.
                    </div>
                )}
            </div>
        </div>
    );
}
