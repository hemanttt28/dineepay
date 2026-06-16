"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Settings,
    LogOut,
    ChefHat,
    Menu as MenuIcon,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = () => {
        // Clear cookie (simple expiration for now)
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#1a0f0a] text-white flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#2C1810]/30 backdrop-blur-xl">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ff6b00] rounded-xl flex items-center justify-center transform rotate-3">
                        <ChefHat className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">Dine <span className="text-[#ff6b00]">e-pay</span></h1>
                        <p className="text-xs text-gray-500">Manager Dashboard</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? "text-white bg-[#ff6b00]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-white/20"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#2C1810]/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#ff6b00] rounded-lg flex items-center justify-center">
                            <ChefHat className="text-white w-5 h-5" />
                        </div>
                        <h1 className="font-bold text-lg">Dine e-pay</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X /> : <MenuIcon />}
                    </button>
                </header>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-16 left-0 right-0 bg-[#1a0f0a] border-b border-white/10 z-50 p-4 space-y-2 shadow-2xl"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.href
                                            ? "bg-[#ff6b00] text-white"
                                            : "text-gray-400 hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
