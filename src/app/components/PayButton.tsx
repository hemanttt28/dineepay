"use client";

import { useState } from "react";
import Script from "next/script";
import { CreditCard, Loader2 } from "lucide-react";

interface PayButtonProps {
    amount: number;
    items: { name: string; quantity: number }[];
    onSuccess?: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PayButton({ amount, items, onSuccess }: PayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1. Create Order
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, items }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Frontend key
                amount: data.amount,
                currency: data.currency,
                name: "Dine e-pay",
                description: "Canteen Order",
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
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
                        alert("Payment Successful!");
                        if (onSuccess) onSuccess();
                    } else {
                        alert("Payment Verification Failed: " + verifyData.message);
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#ff6b00",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed to initialize");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#ff6b00] hover:bg-[#ff8c42] text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now (₹{amount})
                    </>
                )}
            </button>
        </>
    );
}
