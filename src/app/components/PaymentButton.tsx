"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentButton({ amount = 500, children, className, onSuccess }: { amount?: number, children?: React.ReactNode, className?: string, onSuccess?: () => void }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            const res = await fetch('/api/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount }),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: "Dine ePay Request",
                description: "Restaurant Bill Payment",
                order_id: order.id,
                handler: function (response: any) {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    }
                },
                prefill: {
                    name: "Guest User",
                    email: "guest@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#ff6b00",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
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
                disabled={isProcessing}
                className={className || "px-6 py-3 bg-[#ff6b00] text-white font-bold rounded-lg hover:bg-[#ff8c42] transition-colors disabled:opacity-50"}
            >
                {isProcessing ? "Processing..." : children || "Pay Now"}
            </button>
        </>
    );
}
