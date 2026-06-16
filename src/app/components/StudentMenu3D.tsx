"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { MoveRight } from "lucide-react";

const featuredItems = [
    {
        id: 1,
        title: "Sizzling Burger",
        price: "₹149",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
        bgFrom: "from-orange-500/20",
        bgTo: "to-red-500/20",
        shadowColor: "shadow-orange-500/20",
    },
    {
        id: 2,
        title: "Cheesy Pizza",
        price: "₹299",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop",
        bgFrom: "from-red-500/20",
        bgTo: "to-yellow-500/20",
        shadowColor: "shadow-red-500/20",
    },
    {
        id: 3,
        title: "Berry Blast",
        price: "₹129",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop",
        bgFrom: "from-purple-500/20",
        bgTo: "to-pink-500/20",
        shadowColor: "shadow-purple-500/20",
    },
    {
        id: 4,
        title: "Pasta Alfredo",
        price: "₹249",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
        bgFrom: "from-green-500/20",
        bgTo: "to-emerald-500/20",
        shadowColor: "shadow-green-500/20",
    },
    {
        id: 5,
        title: "Club Sandwich",
        price: "₹199",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop",
        bgFrom: "from-blue-500/20",
        bgTo: "to-cyan-500/20",
        shadowColor: "shadow-blue-500/20",
    },
];

export default function StudentMenu3D() {
    return (
        <div className="w-full py-12 overflow-hidden bg-linear-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 px-6"
            >
                <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-red-600 mb-4 tracking-tighter">
                    Featured Menu
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                    Experience our premium dishes with interactive 3D visuals. Hover to explore.
                </p>
            </motion.div>

            <div
                className="flex gap-8 overflow-x-auto px-6 pb-12 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: "smooth" }}
            >
                {featuredItems.map((item) => (
                    <Food3DCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}

function Food3DCard({ title, price, image, bgFrom, bgTo, shadowColor }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            className="flex-none w-[320px] h-[450px] snap-center flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative w-full h-full rounded-[30px] bg-linear-to-br ${bgFrom} ${bgTo} backdrop-blur-3xl border border-white/10 dark:border-white/5 p-6 flex flex-col items-center justify-center group cursor-pointer ${shadowColor} shadow-2xl transition-all duration-300 bg-white/50 dark:bg-zinc-900/50`}
            >
                {/* Floating Image Layer */}
                <motion.div
                    style={{ transform: "translateZ(50px)" }}
                    className="relative w-48 h-48 mb-6 drop-shadow-2xl"
                >
                    {/* Glow behind image */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />

                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-contain rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
                    </motion.div>
                </motion.div>

                {/* Content Layer */}
                <motion.div
                    style={{ transform: "translateZ(30px)" }}
                    className="text-center"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-orange-500 font-bold text-xl mb-4">{price}</p>

                    <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 dark:border-white/10 text-gray-900 dark:text-white backdrop-blur-md transition-all flex items-center gap-2 mx-auto group/btn">
                        Order Now
                        <MoveRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Reflection / Shine Effect */}
                <motion.div
                    style={{ transform: "translateZ(1px)" }}
                    className="absolute inset-0 rounded-[30px] bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
            </motion.div>
        </motion.div>
    );
}
