"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    CreditCard,
    Utensils,
    LayoutDashboard,
    Settings,
    Users,
    LogOut,
    Menu
} from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: CreditCard },
    { name: "Menu Management", href: "/admin/menu", icon: Utensils },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear user session/cookie
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col fixed inset-y-0 z-50">
                <div className="p-6">
                    <h1 className="text-2xl font-black bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                        Dine Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
