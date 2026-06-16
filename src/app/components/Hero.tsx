"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import HeroAnimation from "./HeroAnimation";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex items-center pt-20 lg:pt-0">
            {/* Background Gradient & Glow */}
            <div className="absolute inset-0 bg-[#1a0f0a]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff6b00] rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10 pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div style={{ opacity }} className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-tight">
                            Future of <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ff6b00] to-[#ff8c42]">
                                Dining
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 font-light mb-8"
                    >
                        Experience the smartest canteen management system. Order food, pay with QR, and skip the lines—all from your phone.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Link href="/login">
                            <button className="px-8 py-4 bg-[#ff6b00] hover:bg-[#ff8c42] text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center gap-2 group">
                                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/#features">
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold text-lg transition-all backdrop-blur-md flex items-center gap-2">
                                <Play className="w-4 h-4 fill-white" /> Watch Demo
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative flex justify-center items-center"
                >
                    <HeroAnimation />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 hidden lg:block"
            >
                <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
                </div>
            </motion.div>
        </section >
    );
}
