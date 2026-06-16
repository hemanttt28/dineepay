"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";

function Counter({ from, to }: { from: number; to: number }) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let start = from;
        const end = to;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / (end - start)));

        let timer = setInterval(() => {
            start += 100000;
            if (nodeRef.current) nodeRef.current.textContent = `₹${start.toLocaleString()}+`;
            if (start >= end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [from, to, isInView]);

    return <span ref={nodeRef} className="text-4xl md:text-6xl font-black text-[#ff6b00]">₹0+</span>;
}

export default function SocialProof() {
    return (
        <section className="py-24 bg-[#1a0f0a] border-t border-white/5">
            <div className="container-custom text-center">
                <div className="mb-16">
                    <h2 className="text-2xl text-gray-400 mb-8 uppercase tracking-widest">Trusted by 500+ Restaurants</h2>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos */}
                        {["Spicy Wok", "Burger House", "Tandoor Tales", "Cafe De Paris", "Sushi Roll"].map((logo) => (
                            <span key={logo} className="text-2xl font-bold font-serif text-white">{logo}</span>
                        ))}
                    </div>
                </div>

                <div className="py-12 border-y border-white/10 my-16">
                    <h3 className="text-gray-400 mb-2">Total Transaction Volume</h3>
                    <Counter from={24000000} to={24500000} />
                    <p className="text-gray-500 text-sm mt-4">Processed securely via Dine ePay</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                        { name: "Rahul S.", role: "Owner, Spice Garden", quote: "Table turnover increased by 30% in just one month." },
                        { name: "Priya M.", role: "Manager, The Coffee Club", quote: "No more billing queues. Customers love the speed." }
                    ].map((testi, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left"
                        >
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-[#ff6b00] text-[#ff6b00]" />)}
                            </div>
                            <p className="text-lg text-gray-200 mb-6 italic">"{testi.quote}"</p>
                            <div>
                                <div className="font-bold text-white">{testi.name}</div>
                                <div className="text-gray-500 text-sm">{testi.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
