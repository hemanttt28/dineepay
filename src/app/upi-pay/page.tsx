"use client";

import { useState } from "react";
import Script from "next/script";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UPIPaymentPage() {
    const router = useRouter();
    const [upiId, setUpiId] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handlePayment = async () => {
        if (!upiId || !amount) {
            setErrorMessage("Please enter valid UPI ID and Amount");
            setStatus("error");
            return;
        }

        setStatus("idle");
        setLoading(true);

        try {
            // 1. Create Order
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    items: [], // UPI direct payment usually doesn't involve cart items
                    qrData: {
                        merchantId: upiId,
                        orderId: `UPI-${Date.now()}`,
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create order");

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Dine e-pay",
                description: `Payment to ${upiId}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
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
                            setStatus("success");
                        } else {
                            throw new Error(verifyData.message || "Verification failed");
                        }
                    } catch (err: any) {
                        setErrorMessage(err.message);
                        setStatus("error");
                    }
                },
                prefill: {
                    name: "User",
                    email: "user@example.com",
                    contact: "9999999999",
                    vpa: upiId // Prefill UPI ID if possible (Razorpay might overlook this in some flows)
                },
                theme: {
                    color: "#ff6b00",
                },
                method: {
                    upi: true,
                    card: false,
                    netbanking: false,
                    wallet: false,
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setErrorMessage(response.error.description);
                setStatus("error");
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Error:", error);
            setErrorMessage(error.message || "Something went wrong");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">UPI Payment</h1>
            </header>

            <main className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-[#ff6b00]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v6h-2z" /> {/* Placeholder for UPI Icon */}
                                <text x="50%" y="55%" textAnchor="middle" dy=".3em" fontSize="10px" fontWeight="bold" fill="#ff6b00">UPI</text>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Enter UPI Details</h2>
                        <p className="text-gray-500">Pay directly to any UPI ID</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">UPI ID (VPA)</label>
                            <input
                                type="text"
                                placeholder="e.g. merchant@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 outline-none transition-all text-lg font-medium"
                                disabled={loading || status === 'success'}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₹</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 outline-none transition-all text-2xl font-bold text-gray-900"
                                    disabled={loading || status === 'success'}
                                />
                            </div>
                        </div>
                    </div>

                    {status === "error" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-start gap-3 p-4 bg-red-50 rounded-xl text-red-700 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{errorMessage}</p>
                        </motion.div>
                    )}

                    {status === "success" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-6"
                        >
                            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                            <p className="text-gray-500 mt-2">Transaction completed.</p>
                            <button
                                onClick={() => router.push('/student/dashboard')}
                                className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={loading || !upiId || !amount}
                            className="w-full py-4 bg-[#ff6b00] hover:bg-[#ff8c42] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Proceed to Pay"
                            )}
                        </button>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
