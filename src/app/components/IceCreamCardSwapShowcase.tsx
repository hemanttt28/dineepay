"use client";

import React, { useMemo, useRef } from "react";
import CardSwap, { Card, CardSwapRef } from "./CardSwap";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function IceCreamCardSwapShowcase({
    items,
    onAddToCart
}: {
    items: any[];
    onAddToCart: (item: any) => void
}) {
    const swapRef = useRef<CardSwapRef>(null);

    const stableItems = useMemo(() => items, [items]);

    if (!stableItems || stableItems.length === 0) return null;

    // Pastel/cool color gradients for each ice cream card
    const cardThemes = [
        { bg: "from-pink-400 via-pink-500 to-rose-600", badge: "bg-pink-200 text-pink-900" },
        { bg: "from-amber-400 via-orange-500 to-amber-700", badge: "bg-amber-200 text-amber-900" },
        { bg: "from-red-400 via-pink-500 to-fuchsia-600", badge: "bg-red-200 text-red-900" },
        { bg: "from-yellow-400 via-amber-500 to-orange-600", badge: "bg-yellow-100 text-yellow-900" },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-8">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-purple-400">
                    🍦 Ice Cream Picks
                </h3>
                <p className="text-white/60 mt-2">Click the arrows to browse our cool selections</p>
            </div>

            {/* Card Swap Container */}
            <div className="relative w-full flex items-center justify-center" style={{ height: 440 }}>
                {/* Left Arrow - Desktop */}
                <button
                    onClick={() => swapRef.current?.next()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 hidden md:flex"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow - Desktop */}
                <button
                    onClick={() => swapRef.current?.next()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95 hidden md:flex"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <CardSwap
                    ref={swapRef}
                    width={360}
                    height={420}
                    cardDistance={50}
                    verticalDistance={55}
                    delay={4500}
                    pauseOnHover={true}
                    skewAmount={5}
                    easing="elastic"
                >
                    {stableItems.map((item, idx) => {
                        const theme = cardThemes[idx % cardThemes.length];
                        return (
                            <Card key={item.id} className="p-0 overflow-hidden group cursor-pointer border-0">
                                <div className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl">
                                    {/* Image */}
                                    <div className="relative flex-1 overflow-hidden">
                                        <div className={`absolute inset-0 bg-linear-to-br ${theme.bg} opacity-60 z-10`} />
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Frost overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-20" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                                        {/* Price Badge */}
                                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${theme.badge}`}>
                                            ₹{item.price}
                                        </div>
                                        <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">{item.name}</h3>
                                        <p className="text-white/70 text-sm mb-4">Premium Quality · Freshly Prepared</p>

                                        {/* Add to Cart */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToCart(item);
                                            }}
                                            className="group/btn relative w-full flex items-center justify-center gap-2 py-3 px-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold overflow-hidden transition-all hover:bg-white/25 hover:border-white/50 active:scale-95"
                                        >
                                            <Plus className="w-5 h-5 stroke-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </CardSwap>

                {/* Mobile Arrows */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4 md:hidden z-30">
                    <button
                        onClick={() => swapRef.current?.next()}
                        className="p-3 rounded-full bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => swapRef.current?.next()}
                        className="p-3 rounded-full bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
