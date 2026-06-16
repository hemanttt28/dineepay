"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import ThreeDSodaCan from "./ThreeDSodaCan";
import Image from "next/image";

interface Product {
    id: number;
    name: string;
    subtext: string;
    price: string;
    description: string;
    image?: string; // Fallback image URL
    renderComponent?: React.ReactNode; // Custom 3D component
    bgColor: string; // Background color class or hex
    accentColor: string; // Button/Highlight color
    textColor: string;
}

const iceCreamProducts: Product[] = [
    {
        id: 1,
        name: "Mint Choco Chip",
        subtext: "Premium Scoop",
        price: "₹120",
        description: "Refreshing mint ice cream loaded with rich dark chocolate chips. A cool treat for a hot day.",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
        bgColor: "#b2f7ef", // Mint Green
        accentColor: "#00b4d8",
        textColor: "#0077b6"
    },
    {
        id: 2,
        name: "Strawberry Bliss",
        subtext: "Fresh & Fruity",
        price: "₹110",
        description: "Made with real strawberries for a burst of natural sweetness and vibrant color.",
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop",
        bgColor: "#ffccd5", // Pink
        accentColor: "#ff4d6d",
        textColor: "#a4133c"
    },
    {
        id: 3,
        name: "Dark Chocolate",
        subtext: "Belgian Cacao",
        price: "₹140",
        description: "Intense, velvety dark chocolate ice cream for the true connoisseur.",
        image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=600&auto=format&fit=crop",
        bgColor: "#3e1f47", // Dark Purple/Black
        accentColor: "#9d4edd",
        textColor: "#e0aaff"
    }
];

const coldDrinkProducts: Product[] = [
    {
        id: 101,
        name: "Coca-Cola",
        subtext: "Original Taste",
        price: "₹40",
        description: "The classic refreshment. Crisp, cold, and perfect for any meal.",
        renderComponent: <ThreeDSodaCan color="#F40009" label="Coca-Cola" accentColor="#ffffff" imageSrc="https://pngimg.com/uploads/cocacola/cocacola_PNG22.png" scale={1.2} backgroundText="Coca-Cola" />,
        bgColor: "#1a0505", // Very Dark Cinematic Red
        accentColor: "#e60000",
        textColor: "#ffcccc"
    },
    {
        id: 102,
        name: "Sprite",
        subtext: "Lemon-Lime",
        price: "₹40",
        description: "Clear, crisp lemon-lime soda that hits the spot instantly.",
        renderComponent: <ThreeDSodaCan color="#008B47" label="Sprite" accentColor="#F8CD24" imageSrc="https://pngimg.com/uploads/sprite/sprite_PNG8934.png" scale={0.95} backgroundText="Sprite" />,
        bgColor: "#001a0d", // Very Dark Green
        accentColor: "#00d632",
        textColor: "#ccffcc"
    },
    {
        id: 103,
        name: "Fanta",
        subtext: "Orange Burst",
        price: "₹40",
        description: "Bold orange flavor with tongue-tingling bubbles.",
        renderComponent: <ThreeDSodaCan color="#FF7D00" label="Fanta" accentColor="#00539C" imageSrc="https://pngimg.com/uploads/fanta/fanta_PNG53.png" scale={1.6} backgroundText="Fanta" />,
        bgColor: "#1a0d00", // Very Dark Orange
        accentColor: "#ff9900",
        textColor: "#ffeebb"
    },
    {
        id: 104,
        name: "Pepsi",
        subtext: "Maximum Taste",
        price: "₹40",
        description: "Smooth, refreshing cola with a perfect balance of sweetness.",
        renderComponent: <ThreeDSodaCan color="#004B93" label="Pepsi" accentColor="#C9002B" imageSrc="https://pngimg.com/uploads/pepsi/pepsi_PNG8.png" scale={1.2} backgroundText="Pepsi" />,
        bgColor: "#000a1a", // Very Dark Blue
        accentColor: "#0088ff",
        textColor: "#cceeff"
    }
];

interface PremiumExhibitProps {
    category?: "Ice Cream" | "Ice Cold"; // Default to Ice Cream if not provided
    onAddToCart?: (item: any) => void;
}

export default function PremiumExhibit({ category = "Ice Cream", onAddToCart }: PremiumExhibitProps) {
    const products = category === "Ice Cold" ? coldDrinkProducts : iceCreamProducts;

    // Reset index when category changes
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    useEffect(() => {
        setCurrentIndex(0);
    }, [category]);

    const currentProduct = products[currentIndex];
    const nextIndex = (currentIndex + 1) % products.length;
    const nextProduct = products[nextIndex];

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const variants: Variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.8,
            rotate: dir > 0 ? 10 : -10
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as const, // Explicitly cast as const for readonly tuple
            }
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.8,
            rotate: dir < 0 ? 10 : -10,
            transition: { duration: 0.5 }
        })
    };

    return (
        <div className={`relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-[2.5rem] shadow-2xl transition-colors duration-1000 ease-in-out`}
            style={{ backgroundColor: currentProduct.bgColor }}>

            {/* Background Texture/Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 pointer-events-none" />
            <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full" />

            {/* Main Content Grid */}
            <div className="relative w-full h-full flex flex-col md:flex-row z-10">

                {/* LEFT: Text Content */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-16 pt-12 md:pt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProduct.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20">
                                <span>★ Top Choice</span>
                            </div>

                            <div>
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-lg"
                                    style={{ color: category === "Ice Cream" ? currentProduct.textColor : "#ffffff" }}>
                                    {currentProduct.name}
                                </h1>
                                <p className="text-2xl md:text-3xl font-light italic text-white/80 mt-2">
                                    {currentProduct.subtext}
                                </p>
                            </div>

                            <p className="text-lg text-white/70 max-w-md leading-relaxed">
                                {currentProduct.description}
                            </p>

                            <div className="flex items-center space-x-6 pt-4">
                                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    {currentProduct.price}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAddToCart) {
                                            const priceNum = parseInt(currentProduct.price.replace(/[^0-9]/g, ""));
                                            onAddToCart({ ...currentProduct, price: priceNum });
                                        }
                                    }}
                                    className="px-8 py-4 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 hover:shadow-xl active:scale-95"
                                    style={{ backgroundColor: currentProduct.accentColor }}
                                >
                                    <ShoppingBag size={20} />
                                    Add to Order
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT: Product Visualization */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative">
                    {/* The 3D Item Switcher */}
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentProduct.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none md:pointer-events-auto"
                        >
                            {/* Render Custom Component (3D Can) OR Image */}
                            {currentProduct.renderComponent ? (
                                <div className="scale-110 md:scale-125 transform transition-transform duration-500">
                                    {currentProduct.renderComponent}
                                </div>
                            ) : (
                                <div className="relative w-72 h-72 md:w-96 md:h-96">
                                    <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full scale-90 translate-y-10" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentProduct.image}
                                        alt={currentProduct.name}
                                        className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls (Floating) */}
                    <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">

                        {/* Next Preview Pill */}
                        <div
                            onClick={handleNext}
                            className="group flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 pr-6 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/10 overflow-hidden"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 relative">
                                {nextProduct.renderComponent ? (
                                    /* Use a colored dot for preview if component */
                                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: nextProduct.bgColor }}>
                                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                                    </div>
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={nextProduct.image} className="w-full h-full object-cover" alt="Next" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Next Option</span>
                                <span className="text-sm font-bold text-white group-hover:text-white/90">{nextProduct.name}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white md:bg-white md:text-black">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
