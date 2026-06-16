"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Optimistic update
            setOrders(orders.map(order =>
                order.id === id ? { ...order, status } : order
            ));
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const pendingOrders = orders.filter(o => o.status === "PENDING");
    const completedOrders = orders.filter(o => o.status === "COMPLETED");

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Live <span className="text-[#ff6b00]">Orders</span></h1>
                    <p className="text-gray-400">Track and manage customer orders in real-time.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                    title="Refresh Orders"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {loading && orders.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#ff6b00] animate-spin" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Pending Orders Section */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            Pending Orders ({pendingOrders.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {pendingOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-[#2C1810]/50 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Order ID</p>
                                                <p className="font-mono text-xs text-gray-500 truncate w-24">{order.id}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-white">
                                                        <span className="text-[#ff6b00] font-bold mr-2">{item.quantity}x</span>
                                                        {item.name}
                                                    </span>
                                                    <span className="text-gray-400">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="font-bold text-lg text-white">₹{order.totalAmount}</span>
                                            <button
                                                onClick={() => updateStatus(order.id, "COMPLETED")}
                                                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-xl font-medium transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Complete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {pendingOrders.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                    No pending orders.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Completed Orders Section */}
                    <section className="opacity-60 hover:opacity-100 transition-opacity">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Completed Orders
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-[#2C1810]/30 border border-white/5 rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Order ID</p>
                                            <p className="font-mono text-xs text-gray-500 truncate w-24">{order.id}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">{order.items.length} items</span>
                                        <span className="font-bold text-white">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
