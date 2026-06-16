"use client";

import React from "react";
import CardSwap, { Card } from "./CardSwap";

const canteenFoods = [
    {
        id: 1,
        title: "Sizzling Burger",
        description: "Juicy patty with fresh lettuce, tomatoes, and our signature sauce.",
        price: "₹149",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Cheesy Pizza",
        description: "Classic Margherita loaded with mozzarella and fresh basil.",
        price: "₹299",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Berry Blast",
        description: "Refreshing smoothie blended with mix berries and Greek yogurt.",
        price: "₹129",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Pasta Alfredo",
        description: "Creamy fettuccine served with garlic bread.",
        price: "₹249",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Club Sandwich",
        description: "Triple-layered sandwich with grilled chicken, egg, and veggies.",
        price: "₹199",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop"
    }
];

export default function CardSwapFoodShowcase() {
    return (
        <div className="w-full py-12 overflow-hidden flex flex-col items-center">
            <div className="text-center mb-12 px-6">
                <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-red-600 mb-4 tracking-tighter">
                    Featured Menu
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                    Experience our premium dishes with interactive 3D visuals.
                </p>
            </div>

            <div className="relative w-full max-w-[500px] h-[450px] flex justify-center">
                <CardSwap
                    width={400}
                    height={420}
                    cardDistance={40}
                    verticalDistance={40}
                    delay={4000}
                    pauseOnHover={true}
                    skewAmount={4}
                >
                    {canteenFoods.map((food) => (
                        <Card key={food.id} className="p-0 overflow-hidden group border-0 bg-transparent rounded-3xl shadow-2xl">
                            <div className="relative h-full w-full flex flex-col bg-white dark:bg-zinc-900 rounded-[30px] border border-white/10">
                                <div className="flex-1 overflow-hidden rounded-t-[30px] relative">
                                    <img
                                        src={food.image}
                                        alt={food.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-4 right-4 bg-orange-500 text-white font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        {food.price}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10 transition-transform duration-300 group-hover:-translate-y-2">
                                    <h3 className="text-3xl font-bold mb-3">{food.title}</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed max-w-[90%] mb-6 line-clamp-2">
                                        {food.description}
                                    </p>
                                    <button className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg hover:shadow-orange-500/25 transition-all outline-none">
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardSwap>
            </div>
        </div>
    );
}
