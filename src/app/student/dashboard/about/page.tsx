"use client";

import { motion } from "framer-motion";
import { Info, Zap, Shield, Heart, Smartphone, Clock } from "lucide-react";

export default function AboutPage() {
    const features = [
        {
            icon: Zap,
            title: "Fast Ordering",
            description: "Quick and seamless food ordering experience",
            color: "from-yellow-400 to-orange-500",
        },
        {
            icon: Shield,
            title: "Secure Payments",
            description: "Razorpay integration for safe transactions",
            color: "from-green-400 to-emerald-500",
        },
        {
            icon: Smartphone,
            title: "Mobile Friendly",
            description: "Optimized for all devices and screen sizes",
            color: "from-blue-400 to-indigo-500",
        },
        {
            icon: Clock,
            title: "Real-time Updates",
            description: "Track your order status in real-time",
            color: "from-purple-400 to-pink-500",
        },
    ];

    return (
        <div className="p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                    <Info className="w-10 h-10 text-[#ff6b00]" />
                    About Dine e-pay
                </h1>
                <p className="text-gray-600 mb-8 text-lg">Smart canteen management made simple</p>

                {/* Hero Section */}
                <div
                    className="bg-linear-to-br from-[#ff6b00] to-[#ff8c42] rounded-3xl p-10 mb-8 text-white relative overflow-hidden"
                    style={{
                        boxShadow: "0 20px 40px rgba(255,107,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-black mb-4">Revolutionizing Campus Dining 🍽️</h2>
                        <p className="text-white/95 text-lg leading-relaxed">
                            Dine e-pay is a modern canteen management system designed to make ordering food
                            quick, easy, and cashless. Say goodbye to long queues and hello to seamless
                            digital payments!
                        </p>
                    </div>
                    <div className="absolute -right-12 -bottom-12 text-white/10 text-9xl">🚀</div>
                </div>

                {/* Features Grid */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all"
                                style={{
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(0,0,0,0.03)",
                                }}
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                                >
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div
                    className="bg-white rounded-3xl p-8 text-center"
                    style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                >
                    <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Made with Love</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Developed to enhance the campus dining experience for students and staff. We're
                        constantly improving to serve you better!
                    </p>
                    <p className="text-sm text-gray-400 mt-4">Version 1.0.0 • © 2024 Dine e-pay</p>
                </div>
            </motion.div>
        </div>
    );
}
