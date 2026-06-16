"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { MoveRight } from "lucide-react";

export default function PremiumFoodShowcase() {
    return (
        <section className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 overflow-hidden relative">
            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-purple-500/5 to-blue-500/10 animate-pulse pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-red-600 mb-6 tracking-tighter">
                        Future of Dining
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Experience our premium menu with interactive 3D visuals. Hover to reveal details.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <Food3DCard
                        title="Sizzling Burger"
                        price="₹149"
                        image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop"
                        bgFrom="from-orange-500/20"
                        bgTo="to-red-500/20"
                        shadowColor="shadow-orange-500/20"
                    />
                    <Food3DCard
                        title="Italian Pizza"
                        price="₹299"
                        image="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop"
                        bgFrom="from-red-500/20"
                        bgTo="to-yellow-500/20"
                        shadowColor="shadow-red-500/20"
                    />
                    <Food3DCard
                        title="Fresh Smoothie"
                        price="₹129"
                        image="https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop"
                        bgFrom="from-purple-500/20"
                        bgTo="to-pink-500/20"
                        shadowColor="shadow-purple-500/20"
                    />
                </div>
            </div>
        </section>
    );
}

function Food3DCard({ title, price, image, bgFrom, bgTo, shadowColor }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            className="h-[500px] w-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative w-full h-full rounded-[30px] bg-linear-to-br ${bgFrom} ${bgTo} backdrop-blur-3xl border border-white/10 p-8 flex flex-col items-center justify-center group cursor-pointer ${shadowColor} shadow-2xl transition-all duration-300`}
            >
                {/* Floating Image Layer */}
                <motion.div
                    style={{ transform: "translateZ(50px)" }}
                    className="relative w-64 h-64 mb-8 drop-shadow-2xl"
                >
                    {/* Glow behind image */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />

                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-contain rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
                    </motion.div>
                </motion.div>

                {/* Content Layer */}
                <motion.div
                    style={{ transform: "translateZ(30px)" }}
                    className="text-center"
                >
                    <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-orange-400 font-bold text-xl mb-4">{price}</p>

                    <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-2 mx-auto group/btn">
                        Order Now
                        <MoveRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Reflection / Shine Effect */}
                <motion.div
                    style={{ transform: "translateZ(1px)" }}
                    className="absolute inset-0 rounded-[30px] bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
            </motion.div>
        </motion.div>
    );
}
