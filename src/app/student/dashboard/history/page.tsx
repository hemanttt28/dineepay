"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, CheckCircle, Clock, Package } from "lucide-react";

import BackButton from "../../../components/BackButton";

export default function HistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders");
                if (res.ok) {
                    const data = await res.json();
                    
                    // Map backend data format to frontend expectations
                    const formattedOrders = data.map((order: any) => {
                        let itemNames = [];
                        if (Array.isArray(order.items)) {
                            itemNames = order.items.map((i: any) => i.name || i);
                        } else if (typeof order.items === 'string') {
                            itemNames = [order.items];
                        }

                        // Try parsing metadata for table info or fallback
                        let tableInfo = "Scan / Online";
                        if (order.metadata) {
                            try {
                                const meta = JSON.parse(order.metadata);
                                if (meta.table) tableInfo = meta.table;
                            } catch (e) {}
                        }

                        return {
                            id: order.id.slice(0, 8).toUpperCase(),
                            items: itemNames.length > 0 ? itemNames : ["Custom Order"],
                            total: order.totalAmount,
                            status: order.status.toLowerCase(),
                            date: new Date(order.createdAt).toLocaleString(),
                            table: tableInfo,
                        };
                    });
                    
                    setOrders(formattedOrders);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-5 h-5" />;
            case "pending":
                return <Clock className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    return (
        <div className="p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <BackButton />
                <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                    <History className="w-10 h-10 text-[#ff6b00]" />
                    Order History
                </h1>
                <p className="text-gray-600 mb-8">View all your past orders and receipts</p>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500 font-bold animate-pulse">
                            Loading your orders...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                            <Package className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-bold text-lg">No orders found</p>
                            <p className="text-sm">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all"
                                style={{
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(0,0,0,0.03)",
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{order.id}</h3>
                                        <p className="text-sm text-gray-500">{order.date} • {order.table}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mb-4">
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Items:</p>
                                    <ul className="space-y-1">
                                        {order.items.map((item: string, i: number) => (
                                            <li key={i} className="text-gray-900 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <span className="text-2xl font-black text-[#ff6b00]">₹{order.total}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
