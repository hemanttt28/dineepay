"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, School, Hash, ArrowRight, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";

export default function SearchCanteenPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [canteens, setCanteens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const res = await fetch("/api/canteens");
                if (res.ok) {
                    const data = await res.json();
                    setCanteens(data);
                }
            } catch (error) {
                console.error("Error fetching canteens:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCanteens();
    }, []);

    const filteredCanteens = canteens.filter(c => 
        c.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.collegeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <BackButton />
                
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Find Your <span className="text-[#ff6b00]">Canteen</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Search by college name or unique ID to browse menus</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 group">
                    <div className="absolute -inset-1 bg-linear-to-r from-[#ff6b00] to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="pl-6">
                            <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter College Name or ID (e.g. IIT-123)"
                            className="w-full px-4 py-6 bg-transparent text-white text-lg focus:outline-none placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[#ff6b00] animate-spin mb-4" />
                        <p className="text-gray-500 font-bold">Fetching canteens...</p>
                    </div>
                ) : filteredCanteens.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredCanteens.map((canteen, index) => (
                                <motion.button
                                    key={canteen.collegeId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => router.push(`/student/menu?canteenId=${canteen.collegeId}`)}
                                    className="group text-left p-6 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl hover:border-[#ff6b00]/50 hover:bg-zinc-800/50 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-[#ff6b00]/10 transition-colors">
                                        <School className="w-24 h-24" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                                                <Hash className="w-3 h-3 text-[#ff6b00]" />
                                                <span className="text-[10px] font-black text-[#ff6b00] tracking-wider">{canteen.collegeId}</span>
                                            </div>
                                            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                                <MapPin className="w-3 h-3 text-blue-400" />
                                                <span className="text-[10px] font-black text-blue-400 tracking-wider">ONLINE</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-1 group-hover:text-orange-400 transition-colors">
                                            {canteen.collegeName}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
                                            Open for orders. Browse 40+ snacks and beverages.
                                        </p>

                                        <div className="flex items-center gap-2 text-[#ff6b00] font-bold text-sm">
                                            Visit Canteen <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No canteens found</h3>
                        <p className="text-gray-500 px-10">Try searching for another college name or check if the ID is correct.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
