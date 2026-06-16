"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Store } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [role, setRole] = useState("STUDENT"); // "STUDENT" or "CANTEEN"
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }

                if (role === "CANTEEN" && !collegeName) {
                    setError("College name is required for canteen accounts");
                    setLoading(false);
                    return;
                }

                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, password, role, collegeName: role === "CANTEEN" ? collegeName : undefined }),
                });

                const contentType = res.headers.get("content-type");
                let data;

                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await res.json();
                } else {
                    const textData = await res.text();
                    throw new Error(`Server returned non-JSON: ${textData.substring(0, 100)}...`);
                }

                if (!res.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                alert("Registration successful! Please login.");
                setIsRegistering(false);
                setPassword("");
                setConfirmPassword("");
            } else {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, password }),
                });

                const contentType = res.headers.get("content-type");
                let data;

                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await res.json();
                } else {
                    const textData = await res.text();
                    throw new Error(`Server returned non-JSON: ${textData.substring(0, 100)}...`);
                }

                if (!res.ok) {
                    throw new Error(data.message || "Login failed");
                }

                // Redirect based on role
                if (data.role === "CANTEEN") {
                    router.push("/dashboard");
                } else {
                    router.push("/student/dashboard");
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1a0f0a] relative overflow-hidden flex items-center justify-center">

            {/* Glassmorphism Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
                        Dine <span className="text-[#ff6b00]">e-pay</span>
                    </h1>
                    <p className="text-gray-400">
                        {isRegistering
                            ? (role === "CANTEEN" ? "Create your canteen account" : "Create student account")
                            : "Welcome back!"}
                    </p>
                </div>

                {isRegistering && (
                    <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole("STUDENT")}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === "STUDENT"
                                ? "bg-[#ff6b00] text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("CANTEEN")}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${role === "CANTEEN"
                                ? "bg-[#ff6b00] text-white shadow-lg"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Store className="w-4 h-4" />
                            Canteen
                        </button>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {isRegistering && role === "CANTEEN" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="overflow-hidden"
                        >
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                College Name
                            </label>
                            <input
                                type="text"
                                required={isRegistering && role === "CANTEEN"}
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                placeholder="Enter College Name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                            />
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            User ID
                        </label>
                        <input
                            type="text"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter your User ID"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                        />
                    </div>

                    {isRegistering && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="overflow-hidden"
                        >
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Re-enter Password
                            </label>
                            <input
                                type="password"
                                required={isRegistering}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-all"
                            />
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary-3d py-4 text-lg flex items-center justify-center gap-2 mb-6"
                    >
                        {loading ? "Processing..." : (isRegistering ? "Register" : "Login")}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError("");
                            setUserId("");
                            setPassword("");
                            setConfirmPassword("");
                        }}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        {isRegistering
                            ? "Already have an account? Login"
                            : "New here? Register now"}
                    </button>
                </div>

                {/* Demo Credentials Hint */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Demo Accounts</p>
                        <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded">Click to fill</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegistering(false);
                                setUserId('std01');
                                setPassword('123456');
                            }}
                            className="bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 hover:border-[#ff6b00]/30 transition-all text-left group"
                        >
                            <div className="font-bold text-[#ff6b00] mb-1 group-hover:text-[#ff8c42] flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> Student
                            </div>
                            <div className="text-gray-400">ID: <span className="text-white font-mono bg-black/20 px-1 rounded">std01</span></div>
                            <div className="text-gray-400 mt-1">Pass: <span className="text-white font-mono bg-black/20 px-1 rounded">123456</span></div>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsRegistering(false);
                                setUserId('admin');
                                setPassword('123456');
                            }}
                            className="bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 hover:border-[#ff6b00]/30 transition-all text-left group"
                        >
                            <div className="font-bold text-[#ff6b00] mb-1 group-hover:text-[#ff8c42] flex items-center gap-1">
                                <Store className="w-3 h-3" /> Canteen
                            </div>
                            <div className="text-gray-400">ID: <span className="text-white font-mono bg-black/20 px-1 rounded">admin</span></div>
                            <div className="text-gray-400 mt-1">Pass: <span className="text-white font-mono bg-black/20 px-1 rounded">123456</span></div>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2 z-50"
            >
                ← Back to Home
            </Link>
        </main>
    );
}
