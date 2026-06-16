"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, RefreshCcw, FileX } from "lucide-react";

const problems = [
    {
        icon: Clock,
        title: "Long Waiting Times",
        description: "Customers wait 15+ mins just to pay the bill.",
    },
    {
        icon: AlertTriangle,
        title: "Cash Handling Errors",
        description: "Manual calculations lead to daily revenue leaks.",
    },
    {
        icon: RefreshCcw,
        title: "Slow Table Turnover",
        description: "Delays in billing mean fewer customers served.",
    },
    {
        icon: FileX,
        title: "No Transaction Tracking",
        description: "Blind spots in daily sales and inventory.",
    },
];

export default function ProblemSection() {
    return (
        <section className="py-24 bg-[#2C1810] relative overflow-hidden">
            {/* Subtle Orange Glow Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#ff6b00] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#ff6b00] to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6b00] rounded-full blur-[150px] opacity-20" />
            </div>

            <div className="container-custom relative z-10">


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff6b00]/50 transition-all hover:-translate-y-2 group"
                        >
                            <div className="w-14 h-14 bg-[#ff6b00]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#ff6b00] transition-colors">
                                <item.icon className="w-7 h-7 text-[#ff6b00] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
