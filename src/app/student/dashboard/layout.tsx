"use client";

import { usePathname, useRouter } from "next/navigation";
import FloatingFoodBackground from "../../components/FloatingFoodBackground";
import {
    ShoppingBag,
    Wallet,
    User,
    History,
    Info,
    LogOut,
    Utensils,
    Menu,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false); // Default closed on mobile
            } else {
                setIsSidebarOpen(true); // Default open on desktop
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const navItems = [
        { name: "My Order", icon: ShoppingBag, path: "/student/dashboard" },
        { name: "Wallet", icon: Wallet, path: "/student/dashboard/wallet" },
        { name: "Account", icon: User, path: "/student/dashboard/account" },
        { name: "History", icon: History, path: "/student/dashboard/history" },
        { name: "About", icon: Info, path: "/student/dashboard/about" },
    ];

    const handleLogout = () => {
        router.push("/login"); // Redirect to login
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 relative overflow-x-hidden">
            <FloatingFoodBackground />

            {/* Menu Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                aria-label="Toggle Menu"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isSidebarOpen ? (
                        <X className="w-6 h-6 text-gray-700" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-700" />
                    )}
                </motion.div>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 border-b border-gray-200 flex justify-end">
                    {/* Placeholder for alignment if needed, or just let X cover it on mobile */}
                </div>

                <div className="p-6 pt-0">
                    <div className="flex items-center gap-3 mb-8 mt-2">
                        <div className="w-12 h-12 bg-linear-to-br from-[#ff6b00] to-[#ff8c42] rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform">
                            <Utensils className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 leading-none">
                                Dine <span className="text-[#ff6b00]">e-pay</span>
                            </h1>
                            <span className="text-xs text-gray-500 font-semibold tracking-wider">STUDENT</span>
                        </div>
                    </div>

                    <motion.nav
                        className="space-y-2"
                        initial="closed"
                        animate={isSidebarOpen ? "open" : "closed"}
                        variants={{
                            open: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2
                                }
                            },
                            closed: {
                                transition: {
                                    staggerChildren: 0.05,
                                    staggerDirection: -1
                                }
                            }
                        }}
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <motion.button
                                    key={item.path}
                                    variants={{
                                        open: { x: 0, opacity: 1 },
                                        closed: { x: -20, opacity: 0 }
                                    }}
                                    onClick={() => {
                                        router.push(item.path);
                                        if (isMobile) setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                        ? "bg-linear-to-r from-[#ff6b00] to-[#ff8c42] text-white shadow-[0_8px_16px_rgba(255,107,0,0.3)]"
                                        : "text-gray-700 hover:bg-gray-100/80"
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </motion.button>
                            );
                        })}

                        <motion.button
                            variants={{
                                open: { x: 0, opacity: 1 },
                                closed: { x: -20, opacity: 0 }
                            }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors mt-8"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </motion.button>
                    </motion.nav>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`min-h-screen relative z-10 transition-all duration-300 ease-in-out ${isSidebarOpen && !isMobile ? "ml-72" : "ml-0"
                    }`}
            >
                <div className="pt-16 px-4 lg:pt-0 lg:px-0">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
