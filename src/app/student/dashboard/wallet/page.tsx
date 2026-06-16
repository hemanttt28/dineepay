"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Plus, TrendingUp, ArrowUpRight, ArrowDownLeft, X, Loader2, Shield, LockKeyhole } from "lucide-react";
import BackButton from "../../../components/BackButton";

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [customAmount, setCustomAmount] = useState("");
    const [processing, setProcessing] = useState(false);

    const [showPinModal, setShowPinModal] = useState(false);
    const [password, setPassword] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [pinProcessing, setPinProcessing] = useState(false);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const res = await fetch("/api/me");
            if (res.ok) {
                const data = await res.json();
                setBalance(data.walletBalance || 0);
            }
        } catch (error) {
            console.error("Failed to fetch balance");
        }
    };

    const handleResetPin = async () => {
        if (!password || !newPin) {
            alert("Please fill all fields");
            return;
        }

        if (newPin.length !== 4 || isNaN(Number(newPin))) {
            alert("PIN must be a 4-digit number");
            return;
        }

        if (newPin !== confirmPin) {
            alert("New PIN and Confirm PIN do not match");
            return;
        }

        setPinProcessing(true);

        try {
            const res = await fetch("/api/wallet/reset-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, newPin }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("PIN Reset Successfully!");
                setShowPinModal(false);
                setPassword("");
                setNewPin("");
                setConfirmPin("");
            } else {
                alert(data.message || "Failed to reset PIN");
            }
        } catch (error) {
            console.error("Reset PIN error:", error);
            alert("Something went wrong");
        } finally {
            setPinProcessing(false);
        }
    };

    const handleAddMoney = async () => {
        const amount = selectedAmount || parseFloat(customAmount);

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setProcessing(true);

        try {
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amount,
                    items: [{ name: "Wallet Recharge", quantity: 1, price: amount }],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Create order error:", data);
                throw new Error(data.message || `Server error: ${res.status}`);
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Dine ePay",
                description: "Wallet Recharge",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok) {
                            if (verifyData.newBalance !== null) {
                                setBalance(verifyData.newBalance);
                                alert("Money added successfully!");
                                setShowModal(false);
                                setSelectedAmount(0);
                                setCustomAmount("");
                            } else {
                                alert("Payment verified but failed to update wallet");
                            }
                        } else {
                            alert("Payment verification failed: " + verifyData.message);
                        }
                    } catch (err: any) {
                        console.error("Verification error:", err);
                        alert("Payment verification failed: " + err.message);
                    }
                },
                prefill: {
                    name: "Student",
                    email: "student@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#ff6b00",
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error: any) {
            console.error("Payment error:", error);
            alert("Payment failed: " + (error.message || "Unknown error"));
        } finally {
            setProcessing(false);
        }
    };

    const transactions = [
        { id: 1, type: "debit", amount: 150, description: "Lunch - Combo Meal", date: "Today, 12:30 PM" },
        { id: 2, type: "credit", amount: 500, description: "Wallet Recharge", date: "Yesterday, 3:15 PM" },
        { id: 3, type: "debit", amount: 80, description: "Snacks", date: "Feb 12, 5:00 PM" },
        { id: 4, type: "debit", amount: 200, description: "Dinner", date: "Feb 11, 7:30 PM" },
    ];

    return (
        <div className="p-6 lg:p-10">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-center mb-8">
                    <BackButton />
                    <button
                        onClick={() => setShowPinModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold transition-colors text-sm"
                    >
                        <Shield className="w-4 h-4" />
                        Reset PIN
                    </button>
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-8 mt-4">My Wallet</h1>

                {/* Balance Card */}
                <div
                    className="bg-linear-to-br from-[#ff6b00] to-[#ff8c42] rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
                    style={{
                        boxShadow: "0 20px 40px rgba(255,107,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="w-6 h-6" />
                            <span className="text-white/90 font-medium">Available Balance</span>
                        </div>
                        <h2 className="text-5xl font-black mb-6">₹{balance.toFixed(2)}</h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white text-[#ff6b00] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        >
                            <Plus className="w-5 h-5" />
                            Add Money
                        </button>
                    </div>
                    <div className="absolute -right-12 -bottom-12 text-white/10 text-9xl">💰</div>
                </div>

                {/* Transactions */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-[#ff6b00]" />
                        Recent Transactions
                    </h3>
                    <div className="space-y-3">
                        {transactions.map((txn, index) => (
                            <motion.div
                                key={txn.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all"
                                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${txn.type === "credit"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {txn.type === "credit" ? (
                                            <ArrowDownLeft className="w-6 h-6" />
                                        ) : (
                                            <ArrowUpRight className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{txn.description}</p>
                                        <p className="text-sm text-gray-500">{txn.date}</p>
                                    </div>
                                </div>
                                <p
                                    className={`text-xl font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Add Money Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 pointer-events-auto relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#ff6b00] to-[#ff8c42]" />
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>

                                <div className="flex flex-col items-center mb-6 pt-4">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#ff6b00] mb-4 shadow-inner">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">Add Money</h2>
                                    <p className="text-gray-500 text-center text-sm mt-1">
                                        Select or enter amount to add to your wallet
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => {
                                                    setSelectedAmount(amt);
                                                    setCustomAmount("");
                                                }}
                                                className={`py-3 rounded-xl font-bold transition-all ${selectedAmount === amt
                                                    ? "bg-[#ff6b00] text-white shadow-lg"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                ₹{amt}
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Or enter custom amount</label>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setSelectedAmount(0);
                                            }}
                                            placeholder="Enter amount"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b00] focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddMoney}
                                        disabled={processing || (!selectedAmount && !customAmount)}
                                        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5" />
                                                Add ₹{selectedAmount || customAmount || 0}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Reset PIN Modal */}
            <AnimatePresence>
                {showPinModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPinModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 pointer-events-auto relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gray-900" />
                                <button
                                    onClick={() => setShowPinModal(false)}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>

                                <div className="flex flex-col items-center mb-6 pt-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 mb-4 shadow-inner">
                                        <LockKeyhole className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">Reset Wallet PIN</h2>
                                    <p className="text-gray-500 text-center text-sm mt-1">
                                        Verify your identity to set a new PIN
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Student Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your login password"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">New PIN</label>
                                            <input
                                                type="password"
                                                maxLength={4}
                                                value={newPin}
                                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                                placeholder="0000"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-colors text-center font-mono tracking-widest text-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm</label>
                                            <input
                                                type="password"
                                                maxLength={4}
                                                value={confirmPin}
                                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                                placeholder="0000"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-colors text-center font-mono tracking-widest text-lg"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleResetPin}
                                        disabled={pinProcessing || !password || newPin.length !== 4 || confirmPin.length !== 4}
                                        className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                    >
                                        {pinProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Update PIN"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
