"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { QrCode, Smartphone, CheckCheck, BellRing } from "lucide-react";

const steps = [
    { icon: QrCode, title: "Place QR on Table", desc: "Set up in seconds." },
    { icon: Smartphone, title: "Customer Scans", desc: "Instant menu access." },
    { icon: CheckCheck, title: "Payment Success", desc: "Green tick verification." },
    { icon: BellRing, title: "Canteen Notified", desc: "Real-time alert." },
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const x = useTransform(scrollYProgress, [0.1, 0.9], ["100%", "-100%"]);

    return (
        <section className="py-24 bg-[#2C1810] overflow-hidden" ref={containerRef}>
            <div className="container-custom mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    How It <span className="text-[#ff6b00]">Works</span>
                </h2>
                <p className="text-gray-400">Seamless flow from table to transaction.</p>
            </div>

            <div className="relative w-full overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8 px-8 w-max">
                    {/* Mockup / Visual Section */}
                    <div className="w-[80vw] md:w-[60vw] h-[400px] shrink-0 bg-[#1a0f0a] rounded-3xl border border-white/10 flex items-center justify-center p-8 relative">
                        <div className="absolute inset-0 bg-linear-to-r from-[#ff6b00]/10 via-transparent to-transparent pointer-events-none" />
                        <div className="text-center">
                            <span className="text-9xl">🍕</span>
                            <p className="text-2xl mt-4 text-white font-bold">Floating Food Items</p>
                        </div>
                    </div>

                    {/* Steps Cards */}
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="w-[300px] h-[400px] shrink-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors"
                        >
                            <div className="w-20 h-20 bg-[#ff6b00]/20 rounded-full flex items-center justify-center mb-6">
                                <step.icon className="w-10 h-10 text-[#ff6b00]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
