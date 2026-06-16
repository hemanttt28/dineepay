"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function FeaturedDishHero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden bg-[#8b2e18] flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="circlePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circlePattern)" />
                </svg>
            </div>

            {/* Central Wooden Ring/Platform */}
            <motion.div
                style={{ rotate }}
                className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border-[40px] border-[#a05a2c] opacity-80 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-dashed"
            />

            {/* Central Hero Dish */}
            <motion.div
                style={{ scale, y }}
                className="relative z-20 z-index-top"
            >
                <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                    <Image
                        src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop" // Ramen/Pasta
                        alt="Hero Dish"
                        fill
                        className="object-cover rounded-full shadow-2xl border-4 border-white/10"
                    />
                    {/* Steam Effect */}
                    <motion.div
                        animate={{ opacity: [0, 0.5, 0], y: [-20, -60] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-40 bg-white/20 blur-3xl rounded-full"
                    />
                </div>
            </motion.div>

            {/* Text Overlay */}
            <motion.div
                style={{ opacity }}
                className="absolute top-[15%] md:top-[10%] text-center z-30"
            >
                <h3 className="text-orange-200 tracking-[0.5em] text-sm md:text-lg mb-2 uppercase">Japanese</h3>
                <h1 className="text-6xl md:text-9xl font-black text-[#e8dcc4] tracking-tighter leading-none drop-shadow-xl font-serif">
                    SPICY<br />RAMEN
                </h1>
            </motion.div>

            {/* Orbiting Side Dishes (Top Right & Left) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
            >
                {/* Top Left */}
                <div className="absolute top-[10%] left-[10%] w-40 h-40 md:w-64 md:h-64 -rotate-45">
                    <Image
                        src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop"
                        alt="Side Dish 1"
                        fill
                        className="object-cover rounded-full shadow-xl border-2 border-white/20"
                    />
                </div>
                {/* Top Right */}
                <div className="absolute top-[10%] right-[10%] w-40 h-40 md:w-64 md:h-64 rotate-45">
                    <Image
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
                        alt="Side Dish 2"
                        fill
                        className="object-cover rounded-full shadow-xl border-2 border-white/20"
                    />
                </div>
            </motion.div>

            {/* Floating Ingredients */}
            <FloatingElement
                src="https://images.unsplash.com/photo-1589301760576-415ccd9423c4?w=200&auto=format&fit=crop" // Placeholder for egg/ingredient
                className="w-16 h-16 md:w-24 md:h-24 left-[10%] bottom-[30%]"
                delay={0}
            />
            <FloatingElement
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop" // Sushi
                className="w-12 h-12 md:w-20 md:h-20 right-[15%] bottom-[40%]"
                delay={1}
            />
            <FloatingElement
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop" // Another element
                className="w-14 h-14 md:w-22 md:h-22 right-[25%] top-[60%]"
                delay={2}
            />

            {/* Bottom Actions */}
            <div className="absolute bottom-10 z-30 flex flex-col items-center gap-4">
                <div className="text-center">
                    <p className="text-[#e8dcc4] text-xs tracking-widest uppercase mb-1">Authentic Taste</p>
                    <p className="text-white font-bold text-xl">₹ 149</p>
                </div>
                <button className="px-8 py-3 border border-[#e8dcc4]/50 text-[#e8dcc4] rounded hover:bg-[#e8dcc4] hover:text-[#8b2e18] transition-all uppercase tracking-widest text-sm font-bold">
                    Order Now
                </button>
            </div>

            {/* Chopsticks Decor */}
            <div className="absolute bottom-0 left-20 w-80 h-4 bg-[#d4a373] rotate-45 transform origin-bottom-left opacity-80" />
            <div className="absolute bottom-10 right-20 w-80 h-4 bg-[#d4a373] -rotate-45 transform origin-bottom-right opacity-80" />

        </section>
    );
}

function FloatingElement({ src, className, delay }: { src: string; className: string; delay: number }) {
    return (
        <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute rounded-full overflow-hidden shadow-lg border border-white/10 ${className}`}
        >
            <div className="relative w-full h-full">
                <Image src={src} alt="ingredient" fill className="object-cover" />
            </div>
        </motion.div>
    )
}
