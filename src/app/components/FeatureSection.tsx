"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, LayoutDashboard, Coins, BarChart3, SmartphoneNfc } from "lucide-react";

const features = [
    { icon: Zap, title: "Instant QR Payments", desc: "Transactions settled in seconds." },
    { icon: ShieldCheck, title: "Bank-Level Security", desc: "PCI-DSS compliant protection." },
    { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Manage everything in one place." },
    { icon: Coins, title: "Zero Hardware Cost", desc: "No bulky machines needed." },
    { icon: BarChart3, title: "Real-Time Analytics", desc: "Track sales as they happen." },
    { icon: SmartphoneNfc, title: "Contactless Dining", desc: "Safe and hygienic experience." },
];

export default function FeatureSection() {
    return (
        <section className="py-24 bg-[#1a0f0a] relative">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Everything You Need to <span className="text-[#ff6b00]">Scale</span>
                    </h2>
                    <p className="text-xl text-gray-400">Power-packed features for modern canteens.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 255, 0, 0.3)" }}
                            className="p-8 rounded-2xl bg-[#2C1810] border border-white/5 hover:border-green-500/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-green-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
