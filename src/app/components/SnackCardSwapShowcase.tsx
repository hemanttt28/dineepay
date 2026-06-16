"use client";

import React, { useRef } from "react";
import CardSwap, { Card, CardSwapRef } from "./CardSwap";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function SnackCardSwapShowcase({
    items,
    onAddToCart
}: {
    items: any[];
    onAddToCart: (item: any) => void
}) {
    const swapRef = useRef<CardSwapRef>(null);

    if (!items || items.length === 0) return null;

    return (
        <div className="w-full py-12 flex flex-col items-center">
            <div className="text-center mb-12 px-6">
                <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-amber-600 mb-4 tracking-tighter">
                    Signature Snacks
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
                    Freshly prepared bites to keep you going.
                </p>
            </div>

            <div className="relative w-full max-w-[500px] h-[500px] flex justify-center perspective-distant">
                {/* Navigation Arrows */}
                <button
                    onClick={() => swapRef.current?.next()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-95 hidden md:flex"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => swapRef.current?.next()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-95 hidden md:flex"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <CardSwap
                    ref={swapRef}
                    width={400}
                    height={460}
                    cardDistance={40}
                    verticalDistance={40}
                    delay={4500}
                    pauseOnHover={true}
                    skewAmount={4}
                >
                    {items.map((food, idx) => (
                        <Card key={food.id} className="p-0 overflow-hidden group border-0 bg-transparent rounded-[30px] shadow-2xl">
                            <div className="relative h-full w-full flex flex-col bg-[#111] border border-white/10 rounded-[30px] transition-colors group-hover:border-orange-500/30">
                                <div className="flex-3 overflow-hidden rounded-t-[30px] relative">
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#111] via-[#111]/40 to-transparent" />

                                    <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-md text-white font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        ₹{food.price}
                                    </div>
                                </div>
                                <div className="flex-2 flex flex-col justify-end p-6 md:p-8 pt-0 z-10 transition-transform duration-300">
                                    <h3 className="text-3xl font-bold text-white mb-2">{food.name}</h3>
                                    <p className="text-sm text-gray-400 mb-6">
                                        Perfectly spiced and served hot for the ultimate craving satisfaction.
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(food);
                                        }}
                                        className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-orange-500/25 transition-all outline-none flex items-center justify-center gap-2 group/btn active:scale-95"
                                    >
                                        <span>Add to Cart</span>
                                        <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardSwap>

                {/* Mobile Navigation Arrows */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4 md:hidden z-20">
                    <button
                        onClick={() => swapRef.current?.next()}
                        className="p-3 rounded-full bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => swapRef.current?.next()}
                        className="p-3 rounded-full bg-[#111] border border-white/10 text-white/70 hover:text-white hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
