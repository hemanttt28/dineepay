"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Download, Share2, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    transactionId: string;
    method: string;
    date: string;
}

export default function PaymentSuccessModal({
    isOpen,
    onClose,
    amount,
    transactionId,
    method,
    date,
}: PaymentSuccessModalProps) {
    const [showReceipt, setShowReceipt] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Show animation for 2 seconds, then show receipt
            const timer = setTimeout(() => {
                setShowReceipt(true);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowReceipt(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="relative z-10 w-full max-w-sm">
                        {!showReceipt ? (
                            // Success Animation View
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2,
                                    }}
                                    className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-green-200 shadow-xl"
                                >
                                    <motion.div
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                        <Check className="w-16 h-16 text-white stroke-3" />
                                    </motion.div>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-3xl font-black text-gray-900 mb-2"
                                >
                                    Payment Successful!
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-gray-500 font-medium"
                                >
                                    Processing your receipt...
                                </motion.p>
                            </motion.div>
                        ) : (
                            // Receipt View
                            <motion.div
                                layoutId="receipt"
                                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-2xl"
                            >
                                {/* Receipt Header */}
                                <div className="bg-[#ff6b00] p-6 text-center text-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold opacity-90">Payment Sent</h3>
                                    <h2 className="text-4xl font-black mt-1">₹{amount.toFixed(2)}</h2>
                                </div>

                                {/* Receipt Body */}
                                <div className="p-6 bg-gray-50 relative">
                                    {/* Jagged Edge Effect Top */}
                                    <div className="absolute top-0 left-0 w-full h-4 -mt-2 bg-gray-50 [clip-path:polygon(0%_0%,5%_100%,10%_0%,15%_100%,20%_0%,25%_100%,30%_0%,35%_100%,40%_0%,45%_100%,50%_0%,55%_100%,60%_0%,65%_100%,70%_0%,75%_100%,80%_0%,85%_100%,90%_0%,95%_100%,100%_0%)]" />

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Transaction ID</span>
                                            <span className="text-gray-900 font-mono font-medium text-sm">{transactionId}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Date & Time</span>
                                            <span className="text-gray-900 font-medium text-sm">{date}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Payment Method</span>
                                            <span className="text-gray-900 font-bold capitalize flex items-center gap-2">
                                                {method === 'wallet' ? '👛' : method === 'card' ? '💳' : '📱'} {method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-500 text-sm">Status</span>
                                            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                                                Success
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                                            <Download className="w-4 h-4" /> Save
                                        </button>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full mt-4 py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors transform hover:scale-[1.02] active:scale-95 shadow-lg"
                                    >
                                        <Home className="w-5 h-5" /> Return to Dashboard
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
