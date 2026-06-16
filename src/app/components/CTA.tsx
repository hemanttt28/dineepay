"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 bg-[#1a0f0a] relative overflow-hidden">
            {/* Green Fintech Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />

            <div className="container-custom relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        Ready to Modernize Your Restaurant?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Join 500+ smart restaurants in India. Setup takes less than 10 minutes.
                    </p>

                    <button className="px-10 py-5 bg-white text-[#1a0f0a] rounded-full font-bold text-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 mx-auto">
                        Start Free Today <ArrowRight className="w-6 h-6" />
                    </button>
                    <p className="mt-4 text-gray-500 text-sm">No credit card required for Starter plan.</p>
                </motion.div>
            </div>
        </section>
    );
}
