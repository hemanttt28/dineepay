"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroAnimation() {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
            {/* Main Floating Image */}
            <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 w-full h-full drop-shadow-2xl flex justify-center items-center"
            >
                <div className="relative w-[120%] h-[120%] md:w-[150%] md:h-[150%] pointer-events-none rounded-[40px] overflow-hidden lg:-mr-20 shadow-[0_0_50px_rgba(255,107,0,0.15)]">
                    <Image
                        src="/images/hero-animation.jpg"
                        alt="Dine e-pay food scanner"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Inner shadow/vignette to blend rough edges if it's not transparent */}
                    <div className="absolute inset-0 border border-white/5 rounded-[40px] pointer-events-none" />
                </div>
            </motion.div>

            {/* Optional Floating Glow behind the image */}
            <motion.div
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500 rounded-full blur-[100px] -z-10"
            />
        </div>
    );
}
