"use client";

import React, { useState, useMemo } from "react";
import CircularGallery from "./CircularGallery";
import { Plus } from "lucide-react";

export default function SnackCircularGalleryShowcase({
    items,
    onAddToCart
}: {
    items: any[];
    onAddToCart: (item: any) => void
}) {
    // Current focused item state to know what to add to cart
    const [focusedIndex, setFocusedIndex] = useState(0);

    // CRITICAL: Memoize galleryItems so its reference only changes when `items` changes,
    // NOT when focusedIndex state changes. Without this, every setFocusedIndex call
    // creates a new array → CircularGallery restarts WebGL app → scroll resets to 0 → always item 0.
    const galleryItems = useMemo(() => {
        if (!items || items.length === 0) return [];
        return items.map((item, index) => ({
            id: item.id || index,
            image: item.image || item.image_url || `https://picsum.photos/seed/${index + 1}/800/600?grayscale`,
            text: `${item.name} - ₹${item.price}`
        }));
    }, [items]);

    if (!items || items.length === 0) return null;

    const focusedItem = items[focusedIndex];

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-red-400">
                    Premium Selections
                </h3>
                <p className="text-white/60 mt-2">Swipe around to explore our interactive menu</p>
            </div>

            <div className="w-full relative h-[600px] flex items-center justify-center rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/5 bg-black/20 overflow-hidden">
                <CircularGallery
                    items={galleryItems}
                    bend={3}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    font="bold 28px sans-serif"
                    scrollSpeed={2}
                    scrollEase={0.05}
                    onItemChange={(index) => {
                        // Safely update index
                        if (index >= 0 && index < items.length) {
                            setFocusedIndex(index);
                        }
                    }}
                />

                {/* Overlay Action Button and Info */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center gap-3 w-max min-w-[280px]">

                        {/* Selected Item Info Box (Mirroring the WebGL text for clarity and context) */}
                        <div className="text-center w-full relative">
                            <h4 className="text-white font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis px-2">{focusedItem?.name}</h4>
                            <p className="text-orange-400 font-medium">₹{focusedItem?.price}</p>
                        </div>

                        <div className="w-full h-px bg-white/10"></div>

                        {/* Interactive Add To Cart Box */}
                        <div className="pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (focusedItem) {
                                        onAddToCart(focusedItem);
                                    }
                                }}
                                className="group relative flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-orange-500 to-red-600 rounded-full text-white font-medium overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Plus className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Add to Cart</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
