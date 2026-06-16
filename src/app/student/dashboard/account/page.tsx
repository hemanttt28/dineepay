"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, School, Edit, Shield, Lock, X, Loader2 } from "lucide-react";
import BackButton from "../../../components/BackButton";

export default function AccountPage() {
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinData, setPinData] = useState({ pin: "", confirmPin: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handlePinUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (pinData.pin.length !== 4 || !/^\d+$/.test(pinData.pin)) {
            setMessage({ type: "error", text: "PIN must be a 4-digit number" });
            return;
        }

        if (pinData.pin !== pinData.confirmPin) {
            setMessage({ type: "error", text: "PINs do not match" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/wallet/change-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: pinData.pin }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update PIN");
            }

            setMessage({ type: "success", text: "Wallet PIN updated successfully!" });
            setPinData({ pin: "", confirmPin: "" });
            setTimeout(() => setShowPinModal(false), 2000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const userInfo = {
        name: "Student Name",
        userId: "STU2024001",
        email: "student@university.edu",
        phone: "+91 98765 43210",
        department: "Computer Science",
        year: "3rd Year",
    };

    const InfoCard = ({ icon: Icon, label, value }: any) => (
        <div
            className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ff6b00]">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500 font-medium">{label}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 ml-13">{value}</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <BackButton />
                <h1 className="text-4xl font-black text-gray-900 mb-8">My Account</h1>

                {/* Profile Header */}
                <div
                    className="bg-linear-to-br from-[#ff6b00] to-[#ff8c42] rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
                    style={{
                        boxShadow: "0 20px 40px rgba(255,107,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl">
                            👤
                        </div>
                        <div>
                            <h2 className="text-3xl font-black mb-1">{userInfo.name}</h2>
                            <p className="text-white/90 text-lg">{userInfo.userId}</p>
                            <button
                                className="mt-3 bg-white text-[#ff6b00] px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm"
                                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 text-white/10 text-9xl">🎓</div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <InfoCard icon={Mail} label="Email Address" value={userInfo.email} />
                    <InfoCard icon={Phone} label="Phone Number" value={userInfo.phone} />
                    <InfoCard icon={School} label="Department" value={userInfo.department} />
                    <InfoCard icon={User} label="Academic Year" value={userInfo.year} />
                </div>

                {/* Security Section */}
                <div
                    className="bg-white rounded-3xl p-6"
                    style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-[#ff6b00]" />
                        <h3 className="text-xl font-bold text-gray-900">Security</h3>
                    </div>
                    <div className="space-y-3">
                        <button
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-between group"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                        >
                            <span>Change Password</span>
                            <User className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => setShowPinModal(true)}
                            className="w-full bg-orange-50 hover:bg-orange-100 text-[#ff6b00] px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-between group"
                            style={{ boxShadow: "0 2px 8px rgba(255,107,0,0.05)" }}
                        >
                            <span>Set Wallet PIN</span>
                            <Lock className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* PIN Modal */}
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
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#ff6b00] to-[#ff8c42]" />
                                <button
                                    onClick={() => setShowPinModal(false)}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>

                                <div className="flex flex-col items-center mb-6 pt-4">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#ff6b00] mb-4 shadow-inner">
                                        <Lock className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">Set Wallet PIN</h2>
                                    <p className="text-gray-500 text-center text-sm mt-1">
                                        Create a 4-digit PIN for secure wallet transactions
                                    </p>
                                </div>

                                <form onSubmit={handlePinUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">New PIN</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={4}
                                            required
                                            value={pinData.pin}
                                            onChange={(e) => setPinData({ ...pinData, pin: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b00] focus:ring-0 outline-none transition-colors text-center text-2xl font-bold tracking-widest"
                                            placeholder="••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Confirm PIN</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={4}
                                            required
                                            value={pinData.confirmPin}
                                            onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#ff6b00] focus:ring-0 outline-none transition-colors text-center text-2xl font-bold tracking-widest"
                                            placeholder="••••"
                                        />
                                    </div>

                                    {message.text && (
                                        <div className={`p-3 rounded-lg text-sm font-medium text-center ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update PIN"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
