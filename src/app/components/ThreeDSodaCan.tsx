"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ThreeDSodaCanProps {
    color: string;
    label: string;
    accentColor: string;
    imageSrc?: string; // New prop for Real Life Look
    scale?: number; // Manual visual adjustment
    backgroundText?: string; // Cinematic text behind the can (e.g. "Coca-Cola")
}

export default function ThreeDSodaCan({ color, label, accentColor, imageSrc, scale = 1, backgroundText }: ThreeDSodaCanProps) {
    const [imgError, setImgError] = useState(false);

    // Reset error state when image source changes
    useEffect(() => {
        setImgError(false);
    }, [imageSrc]);

    // Shared Animation
    const floatingAnimation = {
        y: [-15, 15, -15],
        rotate: [2, -2, 2],
        rotateY: [5, -5, 5]
    };

    if (imageSrc) {
        return (
            <div className="relative w-48 h-[320px] md:w-56 md:h-[380px] perspective-1000 flex items-center justify-center pointer-events-none">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>

                {/* Cinematic Background Glow */}
                <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full scale-125 animate-pulse pointer-events-none" />

                {/* Cinematic Background Text: Rendered behind the can */}
                {backgroundText && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-visible z-0 pointer-events-none">
                        <h1
                            className="text-[8rem] md:text-[10rem] font-black tracking-tighter opacity-20 whitespace-nowrap blur-[2px] select-none"
                            style={{
                                color: accentColor,
                                transform: "rotate(-15deg) scale(1.8)",
                                fontFamily: "'Great Vibes', cursive",
                                textShadow: "0 10px 30px rgba(0,0,0,0.5)"
                            }}
                        >
                            {backgroundText}
                        </h1>
                    </div>
                )}

                <motion.div
                    animate={floatingAnimation}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex items-center justify-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] h-full w-full z-10"
                >
                    {/* Error Message if Image Fails */}
                    {imgError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/80 backdrop-blur-md rounded-xl border border-red-500/50 z-50 pointer-events-auto">
                            <span className="text-3xl mb-2">⚠️</span>
                            <p className="text-red-400 font-bold text-sm">Image Load Failed</p>
                            <div className="bg-black/50 p-2 rounded mt-2 max-w-full overflow-hidden">
                                <code className="text-[10px] text-white/70 whitespace-pre-wrap break-all hidden md:block">
                                    {imageSrc}
                                </code>
                            </div>
                        </div>
                    )}

                    {/* Applying scale directly to the image ensures it works independently of parent transforms */}
                    <img
                        src={imageSrc}
                        alt={label}
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className={`h-[90%] w-auto object-contain filter drop-shadow-2xl transition-transform duration-300 pointer-events-auto ${imgError ? 'opacity-0' : 'opacity-100'}`}
                        style={{ transform: `scale(${scale})` }}
                    />
                </motion.div>
            </div>
        );
    }

    // Fallback if no props provided
    return null;
}
