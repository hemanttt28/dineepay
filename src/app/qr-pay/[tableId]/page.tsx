"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PayButton from "../../components/PayButton";
import { CheckCircle, ShoppingCart, Minus, Plus, ChefHat, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
}

interface CartItem extends MenuItem {
    quantity: number;
}

export default function MobileQRPage() {
    const params = useParams();
    const tableId = params.tableId || "1";
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setMenuItems(data);
        } catch (error) {
            console.error("Failed to fetch menu");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
            }
            return prev.filter((i) => i.id !== itemId);
        });
    };

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const categories = Array.from(new Set(menuItems.map((i) => i.category)));

    if (isPaid) {
        return (
            <div className="min-h-screen bg-[#1a0f0a] flex flex-col items-center justify-center text-center p-6 text-white">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
                <p className="text-gray-400 mb-8">
                    The kitchen has started preparing your food.
                </p>
                <button
                    onClick={() => {
                        setIsPaid(false);
                        setCart([]);
                    }}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold"
                >
                    Order More
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a0f0a] text-white pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#1a0f0a]/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#ff6b00] rounded-lg flex items-center justify-center">
                        <ChefHat className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Dine e-pay</h1>
                        <p className="text-xs text-gray-400">Table #{tableId}</p>
                    </div>
                </div>
            </header>

            {/* Menu Sections with 3D Scroll */}
            <main className="p-4 space-y-8 pb-32">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#ff6b00] animate-spin" />
                    </div>
                ) : (
                    categories.map((category) => (
                        <section key={category} className="space-y-4">
                            <h2 className="text-2xl font-black sticky top-[72px] bg-[#1a0f0a]/90 backdrop-blur-xl py-4 z-30 flex items-center gap-2 border-b border-white/5">
                                <span className="w-1 h-6 bg-[#ff6b00] rounded-full"></span>
                                {category}
                            </h2>

                            {/* 3D Vertical Scroll Container */}
                            <div className="h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent space-y-6 perspective-1000 py-4">
                                {menuItems
                                    .filter((item) => item.category === category)
                                    .map((item, index) => {
                                        const inCart = cart.find((i) => i.id === item.id);
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, rotateX: -20, y: 50, scale: 0.9 }}
                                                whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                                                viewport={{ once: false, margin: "-10%" }}
                                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                                className="group relative bg-gradient-to-br from-[#2C1810] to-[#1a0f0a] border border-white/5 rounded-3xl p-4 flex gap-4 shadow-xl hover:shadow-2xl hover:border-[#ff6b00]/30 transition-all preserve-3d"
                                            >
                                                {/* Floating Image */}
                                                <div className="w-28 h-28 bg-[#0a0503] rounded-2xl flex-shrink-0 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Img</div>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-[#ff6b00] transition-colors">{item.name}</h3>
                                                        <p className="text-sm text-gray-400 line-clamp-2">Freshly prepared with premium ingredients.</p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-xl font-black text-white">₹{item.price}</span>

                                                        {item.available ? (
                                                            inCart ? (
                                                                <div className="flex items-center gap-3 bg-[#ff6b00] text-white px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/20">
                                                                    <button onClick={() => removeFromCart(item.id)} className="hover:scale-110 transition-transform"><Minus className="w-4 h-4" /></button>
                                                                    <span className="font-bold w-4 text-center">{inCart.quantity}</span>
                                                                    <button onClick={() => addToCart(item)} className="hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => addToCart(item)}
                                                                    className="px-5 py-2 bg-white/10 hover:bg-white/20 text-sm font-bold rounded-xl transition-all border border-white/10 hover:border-white/30 backdrop-blur-md active:scale-95"
                                                                >
                                                                    Add
                                                                </button>
                                                            )
                                                        ) : (
                                                            <span className="text-red-500 text-sm font-bold bg-red-500/10 px-3 py-1 rounded-lg">Sold Out</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                            </div>
                        </section>
                    ))
                )}
            </main>

            {/* Cart Float */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-[#2C1810] border-t border-white/10 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setIsCartOpen(!isCartOpen)}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ff6b00]/20 rounded-full flex items-center justify-center text-[#ff6b00]">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{cart.reduce((a, b) => a + b.quantity, 0)} Items</p>
                                    <p className="font-bold text-lg">₹{totalAmount}</p>
                                </div>
                            </div>
                            {!isCartOpen && (
                                <button className="text-sm font-bold text-[#ff6b00]">View Cart</button>
                            )}
                        </div>

                        {isCartOpen && (
                            <div className="mb-4 max-h-60 overflow-y-auto space-y-2 border-t border-white/10 pt-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            </div>
                        )}

                        <PayButton
                            amount={totalAmount}
                            items={cart.map((i) => ({ name: i.name, quantity: i.quantity }))}
                            onSuccess={() => setIsPaid(true)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
