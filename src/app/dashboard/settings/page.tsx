"use client";

import { useState } from "react";
import { User, Bell, Shield, Moon, Sun, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState({
        orders: true,
        payments: true,
        system: false,
    });
    const [profile, setProfile] = useState({
        name: "Canteen Manager",
        email: "manager@dine-epay.com",
    });

    const handleSave = () => {
        // In a real app, this would save to the backend
        alert("Settings saved successfully!");
    };

    return (
        <div className="text-white max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black">
                    Settings <span className="text-[#ff6b00]">& Preferences</span>
                </h1>
                <p className="text-gray-400 mt-2">Manage your account and dashboard configuration.</p>
            </header>

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#2C1810]/50 border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-[#ff6b00]/10 rounded-xl">
                            <User className="w-6 h-6 text-[#ff6b00]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Profile Information</h2>
                            <p className="text-sm text-gray-400">Update your personal details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ff6b00] focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#ff6b00] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#2C1810]/50 border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Bell className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Notifications</h2>
                            <p className="text-sm text-gray-400">Manage your alert preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                                <h3 className="font-medium">New Order Alerts</h3>
                                <p className="text-sm text-gray-400">Get notified when a new order arrives</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.orders}
                                    onChange={(e) => setNotifications({ ...notifications, orders: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                                <h3 className="font-medium">Payment Confirmations</h3>
                                <p className="text-sm text-gray-400">Receive alerts for successful payments</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications.payments}
                                    onChange={(e) => setNotifications({ ...notifications, payments: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b00]"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Appearance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#2C1810]/50 border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            {theme === 'dark' ? <Moon className="w-6 h-6 text-purple-500" /> : <Sun className="w-6 h-6 text-yellow-500" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Appearance</h2>
                            <p className="text-sm text-gray-400">Customize your interface theme</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme("dark")}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === "dark"
                                ? "bg-[#ff6b00]/10 border-[#ff6b00] text-[#ff6b00]"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <Moon className="w-6 h-6" />
                            <span className="font-medium">Dark Mode</span>
                        </button>
                        <button
                            onClick={() => setTheme("light")}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === "light"
                                ? "bg-[#ff6b00]/10 border-[#ff6b00] text-[#ff6b00]"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <Sun className="w-6 h-6" />
                            <span className="font-medium">Light Mode</span>
                        </button>
                    </div>
                </motion.div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="btn-primary-3d px-8 py-3 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
