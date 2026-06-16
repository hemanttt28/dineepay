"use client";

import { motion } from "framer-motion";

export default function FloatingFoodBackground() {
    const foodItems = [
        { icon: "🍔", x: "10%", y: "20%", duration: 4 },
        { icon: "☕", x: "80%", y: "15%", duration: 5 },
        { icon: "🥟", x: "20%", y: "80%", duration: 6 },
        { icon: "🥘", x: "75%", y: "70%", duration: 7 },
        { icon: "🥐", x: "50%", y: "50%", duration: 8 },
        { icon: "🍟", x: "85%", y: "40%", duration: 5.5 },
        { icon: "🍕", x: "15%", y: "50%", duration: 6.5 },
        { icon: "🍜", x: "60%", y: "25%", duration: 7.5 },
        { icon: "🥗", x: "30%", y: "60%", duration: 6 },
        { icon: "🍰", x: "70%", y: "85%", duration: 5 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {foodItems.map((item, index) => (
                <motion.div
                    key={index}
                    className="absolute text-6xl opacity-10"
                    initial={{ x: item.x, y: item.y }}
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ left: item.x, top: item.y }}
                >
                    {item.icon}
                </motion.div>
            ))}
        </div>
    );
}
