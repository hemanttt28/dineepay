"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const menuItems = [
    {
        id: 1,
        title: "Spicy Burger",
        price: "₹149",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
        color: "from-orange-500 to-red-600",
    },
    {
        id: 2,
        title: "Cheesy Pizza",
        price: "₹299",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop",
        color: "from-yellow-400 to-orange-500",
    },
    {
        id: 3,
        title: "Berry Smoothie",
        price: "₹129",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop",
        color: "from-pink-500 to-purple-600",
    },
    {
        id: 4,
        title: "Pasta Alfredo",
        price: "₹249",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
        color: "from-green-500 to-emerald-600",
    },
    {
        id: 5,
        title: "Club Sandwich",
        price: "₹199",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop",
        color: "from-blue-500 to-cyan-600",
    },
];

export default function ThreeDMenuCarousel() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-10 px-20">
                    {menuItems.map((item) => (
                        <Card key={item.id} item={item} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

const Card = ({ item }: { item: typeof menuItems[0] }) => {
    return (
        <div
            className="group relative h-[450px] w-[350px] shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-neutral-800"
            style={{
                perspective: "1000px",
            }}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-500 group-hover:scale-105">
                <div className="relative mb-6 h-48 w-48 transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-110">
                    <div className={`absolute inset-0 rounded-full bg-linear-to-br ${item.color} blur-2xl opacity-20`} />
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    {item.title}
                </h3>
                <p className={`text-xl font-bold bg-linear-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.price}
                </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <button className="w-full rounded-xl bg-white/10 py-3 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors font-bold">
                    Add to Order
                </button>
            </div>
        </div>
    );
};
