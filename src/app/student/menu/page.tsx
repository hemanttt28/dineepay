"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import PaymentMethodModal from "@/app/components/PaymentMethodModal";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MoveRight, ShoppingCart, Plus, Minus, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ColdDrinkScroll from "@/app/components/ColdDrinkScroll";
import PremiumExhibit from "@/app/components/PremiumExhibit";
import SnackCircularGalleryShowcase from "@/app/components/SnackCircularGalleryShowcase";
import IceCreamCardSwapShowcase from "@/app/components/IceCreamCardSwapShowcase";

// Menu Data divided by Category
const menuData = {
    "Snacks": [
        { id: 1, name: "Samosa", price: 20, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop" },
        { id: 2, name: "Vada Pav", price: 25, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop" },
        { id: 3, name: "Pav Vada", price: 25, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop" },
        { id: 4, name: "Sandwich", price: 50, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop" },
        { id: 5, name: "Kachori", price: 25, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop" },
        { id: 6, name: "Poha", price: 30, image: "https://images.unsplash.com/photo-1595865725048-897334751f8a?w=800&auto=format&fit=crop" },
        { id: 7, name: "Pav Bhaji", price: 80, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop" },
        { id: 8, name: "Misal Pav", price: 80, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop" },
    ],
    "South Indian": [
        { id: 9, name: "Idli", price: 40, image: "https://images.unsplash.com/photo-1589301760576-415ccd9423c4?w=800&auto=format&fit=crop" },
        { id: 10, name: "Masala Dosa", price: 60, image: "https://images.unsplash.com/photo-1589301760576-415ccd9423c4?w=800&auto=format&fit=crop" },
        { id: 11, name: "Sambhar", price: 30, image: "https://images.unsplash.com/photo-1589301760576-415ccd9423c4?w=800&auto=format&fit=crop" },
        { id: 12, name: "Medu Vada", price: 45, image: "https://images.unsplash.com/photo-1630384060421-2c09d57d6d3d?w=800&auto=format&fit=crop" },
        { id: 13, name: "Mix (Idli/Vada)", price: 50, image: "https://images.unsplash.com/photo-1630384060421-2c09d57d6d3d?w=800&auto=format&fit=crop" },
    ],
    "Ice Cream": [
        { id: 19, name: "Vanilla Cup", price: 30, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop" },
        { id: 20, name: "Chocolate Cone", price: 50, image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&auto=format&fit=crop" },
        { id: 21, name: "Strawberry Stick", price: 40, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop" },
        { id: 22, name: "Butterscotch Scoop", price: 60, image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800&auto=format&fit=crop" },
    ],
};

const categories = [
    { title: "Ice Cold", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop", color: "from-red-600 to-rose-900" },
    { title: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop", color: "from-orange-500 to-amber-700" },
    { title: "South Indian", image: "https://images.unsplash.com/photo-1589301760576-415ccd9423c4?w=500&auto=format&fit=crop", color: "from-yellow-500 to-orange-600" },
    { title: "Ice Cream", image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&auto=format&fit=crop", color: "from-pink-500 to-purple-600" },
];

export default function MenuPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    };

    // Cart Logic
    const handlePaymentComplete = (method: string) => {
        alert(`Payment successful via ${method}!`);
        setCart([]);
        setIsPaymentModalOpen(false);
        router.push("/student/dashboard");
    };

    const [toastMessage, setToastMessage] = useState("");

    const addToCart = (item: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        
        // Show lightweight toast
        setToastMessage(`Added ${item.name} to cart!`);
        setTimeout(() => setToastMessage(""), 2500);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center justify-center pointer-events-none"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="sticky top-0 z-20 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4">
                    {selectedCategory ? (
                        <button
                            onClick={handleBackToCategories}
                            className="p-3 rounded-full bg-white/10 hover:bg-orange-500 transition-colors group"
                        >
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.back()}
                            className="p-3 rounded-full bg-white/10 hover:bg-orange-500 transition-colors group"
                        >
                            <MoveRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    )}

                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
                            {selectedCategory ? selectedCategory : "Canteen Menu"}
                        </h1>
                    </div>
                </div>

                {/* Cart Button */}
                <button
                    onClick={() => setShowCart(true)}
                    className="relative p-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-full border border-orange-500/30 transition-all group"
                >
                    <ShoppingCart className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    )}
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 min-h-[80vh]">

                <AnimatePresence mode="wait">
                    {!selectedCategory ? (
                        // CATEGORY SELECTION VIEW
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleCategoryClick(cat.title)}
                                    className="group relative h-[400px] cursor-pointer perspective-1000"
                                >
                                    <div className={`absolute inset-0 bg-linear-to-br ${cat.color} rounded-[30px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />

                                    <motion.div
                                        whileHover={{ z: 30, rotateX: 5, rotateY: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="relative w-full h-full bg-[#151515] border border-white/10 rounded-[30px] overflow-hidden shadow-2xl transform-style-3d group-hover:border-white/20 transition-colors"
                                    >
                                        {/* Image Background */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src={cat.image}
                                                alt={cat.title}
                                                fill
                                                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-8 translate-z-20">
                                            <h3 className="text-4xl font-black uppercase text-white mb-2 drop-shadow-lg transform translate-z-10 group-hover:translate-x-2 transition-transform">
                                                {cat.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/70 group-hover:text-orange-400 transition-colors">
                                                <span className="text-sm font-bold tracking-widest uppercase">Explore</span>
                                                <MoveRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        // SELECTED CATEGORY VIEW
                        <motion.div
                            key="items"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {selectedCategory === "Ice Cold" ? (
                                <PremiumExhibit category="Ice Cold" onAddToCart={(item) => addToCart(item)} />
                            ) : selectedCategory === "Ice Cream" ? (
                                <IceCreamCardSwapShowcase
                                    items={menuData["Ice Cream"]}
                                    onAddToCart={(item) => addToCart(item)}
                                />
                            ) : selectedCategory === "Snacks" || selectedCategory === "South Indian" ? (
                                <SnackCircularGalleryShowcase
                                    items={menuData[selectedCategory as keyof typeof menuData]}
                                    onAddToCart={(item) => addToCart(item)}
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {(menuData[selectedCategory as keyof typeof menuData] || []).map((item) => (
                                        <Food3DCard
                                            key={item.id}
                                            item={item}
                                            onAddToCart={() => addToCart(item)}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Cart Sidebar (Reused) */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCart(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 z-50 p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <ShoppingCart className="w-6 h-6 text-orange-500" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.name}</h3>
                                                    <p className="text-orange-400 text-sm">₹{item.price}</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1 hover:text-red-400 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1 hover:text-green-400 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <div className="flex justify-between items-center text-xl font-bold mb-6">
                                            <span>Total</span>
                                            <span className="text-orange-500">₹{totalAmount}</span>
                                        </div>
                                        <button
                                            onClick={() => setIsPaymentModalOpen(true)}
                                            className="w-full py-4 bg-linear-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <PaymentMethodModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={totalAmount}
                walletBalance={0}
                onPaymentComplete={handlePaymentComplete}
            />
        </div>
    );
}

// 3D Card Component (Reused Animation Logic)
function Food3DCard({ item, onAddToCart }: { item: any; onAddToCart: () => void }) {
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
            style={{ perspective: 1000 }}
            className="h-[400px] w-full flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full rounded-[30px] bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 flex flex-col items-center justify-between group cursor-pointer shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
            >
                {/* Floating Image Layer */}
                <motion.div
                    style={{ transform: "translateZ(80px)" }}
                    className="relative w-48 h-48 mt-4 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                >
                    <div className="absolute inset-0 bg-orange-500/40 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
                    </motion.div>
                </motion.div>

                {/* Content Layer */}
                <motion.div
                    style={{ transform: "translateZ(30px)" }}
                    className="text-center w-full"
                >
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-orange-400 font-bold text-2xl mb-4">₹{item.price}</p>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart();
                        }}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-orange-500 border border-white/20 hover:border-orange-500 text-white backdrop-blur-md transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <span>Add</span>
                        <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
