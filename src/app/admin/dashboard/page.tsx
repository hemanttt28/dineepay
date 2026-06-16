"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    ShoppingBag,
    Clock,
    School,
    Hash
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const stats = [
    { title: "Total Revenue", value: "₹45,231", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
    { title: "Active Orders", value: "12", icon: ShoppingBag, color: "from-blue-500 to-indigo-600" },
    { title: "Total Users", value: "1,234", icon: Users, color: "from-purple-500 to-pink-600" },
    { title: "Avg. Wait Time", value: "18m", icon: Clock, color: "from-orange-500 to-red-600" },
];

const chartData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 2000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
];

export default function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState<{ collegeName: string; collegeId: string } | null>(null);

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await fetch("/api/me");
                if (res.ok) {
                    const data = await res.json();
                    setAdminInfo({
                        collegeName: data.collegeName || "Not Set",
                        collegeId: data.collegeId || "Not Set"
                    });
                }
            } catch (error) {
                console.error("Error fetching admin info:", error);
            }
        };
        fetchAdminInfo();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                
                {adminInfo && (
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl">
                            <School className="w-4 h-4 text-[#ff6b00]" />
                            <span className="text-sm font-bold text-gray-700 dark:text-orange-200">{adminInfo.collegeName}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                            <Hash className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-gray-700 dark:text-blue-200">{adminInfo.collegeId}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} text-white shadow-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    +12.5%
                                </span>
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Revenue</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33333320" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', borderColor: '#f97316' }}
                                    itemStyle={{ color: '#f97316' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Order #{1000 + i}</p>
                                        <p className="text-xs text-gray-500">2 mins ago</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded-lg">
                                    Preparing
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
