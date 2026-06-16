"use client";

import { useEffect, useState } from "react";
import { LogOut, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    tableId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todaysSales: 0,
        activeTables: 0,
        pendingOrders: 0
    });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/orders");
            const data: Order[] = await res.json();
            setOrders(data);
            calculateStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: Order[]) => {
        const today = new Date().toDateString();

        // Today's Sales (Completed only)
        const todaysSales = data
            .filter(o => o.status === "COMPLETED" && new Date(o.createdAt).toDateString() === today)
            .reduce((sum, order) => sum + order.totalAmount, 0);

        // Pending Orders
        const pending = data.filter(o => o.status === "PENDING" || o.status === "PAID"); // Paid but not completed

        // Active Tables (Unique tables with pending orders)
        const uniqueTables = new Set(pending.map(o => o.tableId));

        setStats({
            todaysSales,
            activeTables: uniqueTables.size,
            pendingOrders: pending.length
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            COMPLETED: "bg-green-500/20 text-green-500",
            PENDING: "bg-yellow-500/20 text-yellow-500",
            PAID: "bg-blue-500/20 text-blue-500",
            CANCELLED: "bg-red-500/20 text-red-500"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-500/20 text-gray-500"}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 text-[#ff6b00] animate-spin" />
            </div>
        );
    }

    return (
        <div className="text-white">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black">
                        Dashboard <span className="text-[#ff6b00]">Overview</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome back to your canteen command center.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Stats Card 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#2C1810] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#ff6b00]/30 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-24 h-24 bg-[#ff6b00] rounded-full blur-3xl"></div>
                    </div>
                    <h3 className="text-gray-400 mb-2 relative z-10">Today's Sales</h3>
                    <p className="text-4xl font-bold relative z-10">₹{stats.todaysSales.toLocaleString()}</p>
                </motion.div>

                {/* Stats Card 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#2C1810] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#ff6b00]/30 transition-colors"
                >
                    <h3 className="text-gray-400 mb-2">Active Tables</h3>
                    <p className="text-4xl font-bold">{stats.activeTables}</p>
                </motion.div>

                {/* Stats Card 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#2C1810] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#ff6b00]/30 transition-colors"
                >
                    <h3 className="text-gray-400 mb-2">Pending Orders</h3>
                    <p className={`text-4xl font-bold ${stats.pendingOrders > 0 ? "text-[#ff6b00]" : "text-white"}`}>
                        {stats.pendingOrders}
                    </p>
                </motion.div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
                <div className="bg-[#2C1810]/50 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Table</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.slice(0, 10).map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-300">
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-gray-500">
                                            {order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            {order.tableId ? `Table #${order.tableId}` : 'Takeaway'}
                                        </td>
                                        <td className="p-4 font-bold">₹{order.totalAmount}</td>
                                        <td className="p-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No transactions yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
