"use client";

import { motion } from "framer-motion";
import { Scan, CreditCard, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: Scan,
        title: "Customer Scans QR",
        desc: "No apps needed. Just camera.",
    },
    {
        icon: CreditCard,
        title: "Pays Securely",
        desc: "UPI, Cards, or Netbanking.",
    },
    {
        icon: CheckCircle,
        title: "Instant Confirmation",
        desc: "You get notified immediately.",
        highlight: true,
    },
];

export default function SolutionSection() {
    return (
        <section className="py-24 bg-[#1a0f0a] relative">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        Dine ePay Solves It in <span className="text-green-500">Seconds</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative z-10 p-8 rounded-3xl border ${step.highlight
                                ? "bg-green-900/20 border-green-500/50"
                                : "bg-[#2C1810] border-white/10"
                                } flex flex-col items-center text-center shadow-lg`}
                        >
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-3xl font-bold ${step.highlight ? "bg-green-500 text-white" : "bg-[#ff6b00] text-white"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-400">{step.desc}</p>
                            {step.highlight && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 1 }}
                                    className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                                >
                                    <CheckCircle className="w-8 h-8" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
