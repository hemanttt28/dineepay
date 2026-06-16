"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const sodaCans = [
    {
        id: 1,
        name: "Coca-Cola",
        color: "#F40009", // Official Coke Red
        logoText: "Coca-Cola",
        logoFont: "'Loki Cola', cursive", // We'll simulate with nearest font
        accentColor: "#ffffff",
        description: "Original Taste",
        gradientStop1: "#db1f29",
        gradientStop2: "#ab0e16"
    },
    {
        id: 2,
        name: "Sprite",
        color: "#008B47", // Official Sprite Green
        logoText: "Sprite",
        logoFont: "sans-serif",
        accentColor: "#F8CD24", // Yellow accent
        description: "Lemon-Lime",
        gradientStop1: "#009b3a",
        gradientStop2: "#005c23"
    },
    {
        id: 3,
        name: "Fanta",
        color: "#FF7D00", // Official Fanta Orange
        logoText: "Fanta",
        logoFont: "sans-serif",
        accentColor: "#00539C", // Blue accent
        description: "Orange",
        gradientStop1: "#ff8c00",
        gradientStop2: "#cc5500"
    },
    {
        id: 4,
        name: "Pepsi",
        color: "#004B93", // Official Pepsi Blue
        logoText: "Pepsi",
        logoFont: "sans-serif",
        accentColor: "#C9002B", // Red accent
        description: "Cola",
        gradientStop1: "#005cb8",
        gradientStop2: "#003264"
    }
];

export default function ColdDrinkScroll() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    return (
        <section ref={targetRef} className="relative w-full min-h-[100vh] overflow-hidden bg-[#111] flex items-center justify-center py-20">
            {/* Realistic Studio Lighting Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#222] via-[#000] to-[#111]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Ice Cold
                    </h2>
                    <p className="text-gray-400 text-xl tracking-widest font-light uppercase">Premium Selection</p>
                </motion.div>

                {/* Cans Row */}
                <motion.div
                    style={{ y }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 perspective-1000"
                >
                    {sodaCans.map((can, index) => (
                        <RealSodaCan key={can.id} can={can} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function RealSodaCan({ can, index }: { can: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            className="relative group flex flex-col items-center"
        >
            {/* Realistic Shadow */}
            <div className="absolute -bottom-6 w-32 h-4 bg-black/80 blur-xl rounded-full opacity-60 group-hover:scale-75 transition-transform duration-500 delay-75" />

            {/* Floating Animation Wrapper */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotateZ: [0, 1, -1, 0]
                }}
                transition={{
                    duration: 4 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                }}
                className="relative w-40 h-[260px] md:w-48 md:h-[310px] transform-style-3d group-hover:scale-105 transition-transform duration-500 ease-in-out"
            >
                {/* 
                    CONSTRUCTING THE CAN 
                    We use multiple layers to simulate the cylinder + top/bottom rim + metallic reflection 
                */}

                {/* 1. Can Body Cylinder */}
                <div
                    className="absolute inset-x-0 top-[10%] bottom-[5%] rounded-lg overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"
                    style={{
                        background: `linear-gradient(90deg, 
                            ${can.gradientStop2} 0%, 
                            ${can.gradientStop1} 20%, 
                            ${can.color} 45%, 
                            ${can.gradientStop1} 55%, 
                            ${can.gradientStop2} 100%)`
                    }}
                >
                    {/* Metallic Grain Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aluminum.png')]" />

                    {/* Left & Right Shadow for Roundness */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 mix-blend-multiply" />

                    {/* Vibrant Highlight Center */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-overlay" />

                    {/* Sharp Specular Reflection Stripe */}
                    <div className="absolute top-0 left-[25%] w-[10%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] opacity-70" />

                    {/* LOGO Placement - Correctly rotated text */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="transform -rotate-90 scale-125 md:scale-150">
                            <h3
                                style={{
                                    color: can.accentColor,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    fontFamily: can.logoFont === 'sans-serif' ? 'Impact, sans-serif' : 'serif',
                                    fontStyle: can.logoFont !== 'sans-serif' ? 'italic' : 'normal',
                                    fontWeight: '900',
                                    letterSpacing: '-1px'
                                }}
                                className="text-5xl md:text-6xl whitespace-nowrap"
                            >
                                {can.logoText}
                            </h3>
                        </div>
                    </div>

                    {/* Condensation Droplets */}
                    {/* We create randomized droplets for realism */}
                    <div className="absolute inset-0 z-20">
                        <WaterDroplets />
                    </div>
                </div>

                {/* 2. Top Rim (Silver Metallic) */}
                <div className="absolute top-[8%] left-0 right-0 h-[30px] bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 rounded-[50%] z-10 border-b border-gray-400 shadow-md">
                    {/* Inner Rim Depth */}
                    <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 rounded-[50%]" />
                    {/* Top Lid Surface */}
                    <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] bg-gradient-to-b from-gray-300 to-gray-100 rounded-[50%] flex items-center justify-center overflow-hidden">
                        <div className="w-[60%] h-[60%] border border-gray-400/50 rounded-full" />
                        {/* Pull Tab Hint */}
                        <div className="absolute w-[20%] h-[50%] bg-gray-400 rounded-sm transform rotate-45 shadow-sm" />
                    </div>
                </div>

                {/* 3. Bottom Rim (Silver Metallic) */}
                <div className="absolute bottom-[3%] left-[2%] right-[2%] h-[20px] bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-b-[20px] rounded-t-[5px] z-0 shadow-lg"></div>

            </motion.div>

            {/* Brand Name Below */}
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <h4 className="text-white font-bold text-xl tracking-wide">{can.name}</h4>
                <p className="text-gray-500 text-sm">{can.description}</p>
                <div className="mt-2 text-orange-500 font-bold">₹40</div>
            </div>
        </motion.div>
    );
}

// Separate component for realistic droplets to keep code clean
function WaterDroplets() {
    // Generate static positions for droplets to avoid flicker on rerender, 
    // wrapped in a stable way or realistic fixed pattern
    const droplets = Array.from({ length: 25 }).map((_, i) => ({
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 80 + 10}%`,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 5
    }));

    return (
        <>
            {droplets.map((d, i) => (
                <div
                    key={i}
                    className="absolute bg-white/70 rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.3)] backdrop-blur-[1px]"
                    style={{
                        left: d.left,
                        top: d.top,
                        width: `${d.size}px`,
                        height: `${d.size}px`,
                        opacity: 0.6
                    }}
                />
            ))}
            {/* A few dripping ones */}
            {[1, 2, 3].map((_, i) => (
                <motion.div
                    key={`drip-${i}`}
                    className="absolute w-[3px] h-[3px] bg-white/80 rounded-full"
                    style={{ left: `${20 + i * 30}%`, top: '20%' }}
                    animate={{ y: [0, 150], opacity: [0.8, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "easeIn", delay: i * 1.5 }}
                />
            ))}
        </>
    );
}
