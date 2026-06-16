"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, CreditCard, Smartphone, CheckCircle, Loader2, Lock } from "lucide-react";

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    walletBalance: number; // Prop might be unused if we fetch internally, but keeping for backward compat
    onPaymentComplete: (method: string) => void;
    qrData?: { merchantId: string; orderId: string } | null; // QR scanner data
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentMethodModal({
    isOpen,
    onClose,
    amount,
    onPaymentComplete,
    qrData,
}: PaymentMethodModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [localAmount, setLocalAmount] = useState(amount);

    useEffect(() => {
        setLocalAmount(amount);
    }, [amount]);

    // User State
    const [user, setUser] = useState<{ userId: string; walletBalance: number } | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // PIN State
    const [pin, setPin] = useState("");
    const [showPinInput, setShowPinInput] = useState(false);
    const [pinError, setPinError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchUser();
            // Load Razorpay Script if not already loaded
            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.id = "razorpay-checkout-js";
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, [isOpen]);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user");
        } finally {
            setLoadingUser(false);
        }
    };

    const handlePinChange = (value: string) => {
        if (value.length <= 4 && /^\d*$/.test(value)) {
            setPin(value);
            setPinError("");
        }
    };

    const handlePayment = async () => {
        if (!selectedMethod) return;

        if (selectedMethod === "wallet") {
            if (!showPinInput) {
                setShowPinInput(true);
                return;
            }

            if (pin.length !== 4) {
                setPinError("Please enter a 4-digit PIN");
                return;
            }

            setProcessing(true);
            try {
                const res = await fetch("/api/wallet/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user?.userId,
                        amount: localAmount,
                        pin: pin,
                        items: []
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setPinError(data.message || "Payment failed");
                    setProcessing(false);
                } else {
                    onPaymentComplete("wallet");
                    onClose();
                }
            } catch (error) {
                setPinError("Network error");
                setProcessing(false);
            }
            return;
        }

        // Razorpay Payment Flow...
        setProcessing(true);
        try {
            // Prepare order items with QR data if available
            const orderDescription = qrData
                ? `QR Payment - Merchant: ${qrData.merchantId}, Order: ${qrData.orderId}`
                : "Canteen Payment";

            const orderItems = qrData
                ? [{
                    name: `QR Order ${qrData.orderId}`,
                    quantity: 1,
                    price: localAmount,
                    merchantId: qrData.merchantId
                }]
                : [{ name: "Canteen Order", quantity: 1, price: localAmount }];

            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: localAmount,
                    items: orderItems,
                    qrData: qrData, // Pass QR data to backend
                }),
            });

            if (!res.ok) throw new Error("Failed to create order");
            const data = await res.json();

            if (!window.Razorpay) {
                alert("Payment SDK failed to load.");
                setProcessing(false);
                return;
            }

            const options = {
                key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_ScuxKVZkWnFOSE",
                amount: data.amount,
                currency: data.currency,
                name: "Dine e-Pay",
                description: orderDescription,
                order_id: data.orderId,
                prefill: {
                    name: user?.userId || "Student",
                    email: `${user?.userId || "student"}@dineepay.com`,
                    contact: "9999999999"
                },
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                qrData: qrData, // Include QR data in verification
                            }),
                        });

                        if (verifyRes.ok) {
                            onPaymentComplete(selectedMethod);
                            onClose();
                        } else {
                            alert("Payment verification failed");
                        }
                    } catch (err) {
                        alert("Payment verification error");
                    }
                },
                prefill: qrData ? {
                    notes: {
                        merchant_id: qrData.merchantId,
                        qr_order_id: qrData.orderId,
                    }
                } : {},
                notes: qrData ? {
                    merchant_id: qrData.merchantId,
                    qr_order_id: qrData.orderId,
                    payment_source: "qr_scanner"
                } : {
                    payment_source: "manual"
                },
                theme: {
                    color: "#ff6b00",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                alert(response.error.description);
                setProcessing(false);
            });
            rzp1.open();
            setProcessing(false);
        } catch (error) {
            alert("Failed to initiate payment");
            setProcessing(false);
        }
    };

    const paymentMethods = [
        {
            id: "wallet",
            name: "Wallet",
            icon: Wallet,
            color: "from-green-400 to-emerald-500",
            available: user && user.walletBalance >= localAmount,
            balance: user?.walletBalance || 0,
        },
        {
            id: "upi",
            name: "UPI",
            icon: Smartphone,
            color: "from-blue-400 to-indigo-500",
            available: true,
        },
        {
            id: "card",
            name: "Card / Online",
            icon: CreditCard,
            color: "from-purple-400 to-pink-500",
            available: true,
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-linear-to-r from-[#ff6b00] to-[#ff8c42] p-6 text-white relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-black mb-2">Select Payment Method</h2>
                                {amount === 0 ? (
                                    <div className="flex items-center text-3xl font-black bg-white/20 rounded-xl px-4 py-2 mt-2 max-w-[200px]">
                                        <span>₹</span>
                                        <input 
                                            type="number"
                                            value={localAmount || ""}
                                            onChange={(e) => setLocalAmount(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full ml-2"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <p className="text-3xl font-black">₹{localAmount.toFixed(2)}</p>
                                )}
                            </div>

                            <div className="p-6 space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    const isSelected = selectedMethod === method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => method.available && setSelectedMethod(method.id)}
                                            disabled={!method.available}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all ${isSelected
                                                ? "border-[#ff6b00] bg-orange-50"
                                                : method.available
                                                    ? "border-gray-200 hover:border-gray-300 bg-white"
                                                    : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-xl bg-linear-to-br ${method.color} flex items-center justify-center text-white shadow-lg`}
                                                >
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <h3 className="font-bold text-gray-900">{method.name}</h3>
                                                    {method.id === "wallet" && (
                                                        <p className={`text-sm ${method.available ? "text-green-600" : "text-red-600"}`}>
                                                            {user ? `Balance: ₹${method.balance?.toFixed(2)}` : "Login to use Wallet"}
                                                        </p>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="w-6 h-6 text-[#ff6b00]" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* PIN Input for Wallet */}
                            {selectedMethod === "wallet" && showPinInput && (
                                <div className="px-6 pb-4">
                                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock className="w-5 h-5 text-orange-600" />
                                            <h3 className="font-bold text-gray-900">Enter Wallet PIN</h3>
                                        </div>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={4}
                                            value={pin}
                                            onChange={(e) => handlePinChange(e.target.value)}
                                            placeholder="••••"
                                            className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                                            autoFocus
                                        />
                                        {pinError && (
                                            <p className="text-red-500 text-sm mt-2 text-center font-medium">{pinError}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2 text-center">Default PIN: 1234</p>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 pt-0">
                                <button
                                    onClick={handlePayment}
                                    disabled={!selectedMethod || processing || (selectedMethod === "wallet" && showPinInput && pin.length !== 4) || localAmount <= 0}
                                    className="w-full py-4 btn-primary-3d text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : selectedMethod === "wallet" && !showPinInput ? (
                                        "Continue"
                                    ) : (
                                        "Pay Now"
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
