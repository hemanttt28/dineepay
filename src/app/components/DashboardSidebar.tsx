"use client";

import { Home, BarChart2, DollarSign, QrCode, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: BarChart2, label: "Transactions", href: "/dashboard/transactions" },
    { icon: DollarSign, label: "Revenue", href: "/dashboard/revenue" },
    { icon: QrCode, label: "QR Management", href: "/dashboard/qr" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#1a0f0a] border-r border-white/10 h-screen fixed left-0 top-0 hidden md:flex flex-col">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6b00] to-[#ff8c42] bg-clip-text text-transparent">
                    Dine ePay
                </h1>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Admin Panel</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                ? "bg-[#ff6b00]/10 text-[#ff6b00] font-medium"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
