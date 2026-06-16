"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PaymentMethodModal from "../../components/PaymentMethodModal";
import PaymentSuccessModal from "../../components/PaymentSuccessModal";
import QRScannerModal from "../../components/QRScannerModal";
import { Utensils, TrendingUp, Clock, Sparkles, QrCode, CreditCard } from "lucide-react";
import { useState } from "react";

export default function StudentDashboard() {
    const router = useRouter();
    const [showPayment, setShowPayment] = useState(false);
    const [scannedAmount, setScannedAmount] = useState(0);
    const walletBalance = 1250.50; // This would come from API/state

    // QR Scanner State
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [qrData, setQrData] = useState<{ merchantId: string; orderId: string } | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [transactionData, setTransactionData] = useState({
        amount: 0,
        transactionId: "",
        method: "",
        date: "",
    });

    const handleQRScanned = (data: { amount: number; merchantId: string; orderId: string }) => {
        setQrData({ merchantId: data.merchantId, orderId: data.orderId });
        setScannedAmount(data.amount);
        setShowQRScanner(false);
        setShowPayment(true);
    };

    const handlePaymentComplete = (method: string) => {
        // Simulate API success
        setTransactionData({
            amount: scannedAmount,
            transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
            method: method,
            date: new Date().toLocaleString(),
        });
        setShowSuccess(true);
    };

    const quickActions = [
        {
            title: "Scan QR & Pay",
            description: "Scan QR to pay with UPI, Card, or Wallet",
            icon: QrCode,
            color: "from-orange-400 to-red-500",
            action: () => setShowQRScanner(true),
        },
        {
            title: "UPI Pay",
            description: "Pay directly to any UPI ID",
            icon: CreditCard,
            color: "from-blue-500 to-cyan-500",
            action: () => router.push("/upi-pay"),
        },
        {
            title: "Browse Menu",
            description: "View today's specials and place an order",
            icon: Utensils,
            color: "from-green-400 to-emerald-500",
            action: () => router.push("/student/search"), // Changed to search first
        },
        {
            title: "Search Canteens",
            description: "Find canteens by college name or ID",
            icon: QrCode,
            color: "from-blue-500 to-cyan-500",
            action: () => router.push("/student/search"),
        },
        {
            title: "My Wallet",
            description: "Check balance and add funds",
            icon: TrendingUp,
            color: "from-blue-400 to-indigo-500",
            action: () => router.push("/student/dashboard/wallet"),
        },
        {
            title: "Order History",
            description: "View past orders and receipts",
            icon: Clock,
            color: "from-purple-400 to-pink-500",
            action: () => router.push("/student/dashboard/history"),
        },
    ];

    return (
        <div className="p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                    Welcome Back!
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                </h1>
                <p className="text-gray-600 text-lg">What would you like to do today?</p>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={action.action}
                            className="group relative bg-white rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] active:scale-95 border-b-4 border-gray-100 active:border-b-0"
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl bg-linear-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 duration-300`}
                            >
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{action.title}</h3>
                            <p className="text-gray-600 text-sm">{action.description}</p>
                        </motion.button>
                    );
                })}
            </div>

            {/* Promo Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative bg-linear-to-r from-[#ff6b00] to-[#ff8c42] rounded-3xl p-8 text-white overflow-hidden"
                style={{
                    boxShadow:
                        "0 20px 40px rgba(255,107,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-3">🎓 Student Discount!</h2>
                    <p className="text-white/95 max-w-2xl text-lg">
                        Get an extra <strong>10% OFF</strong> on all combo meals. Show your student ID at
                        the counter if requested.
                    </p>
                </div>
                <div className="absolute -right-8 -bottom-8 text-white/10 text-9xl">🍔</div>
            </motion.div>

            {/* QR Scanner Modal */}
            <QRScannerModal
                isOpen={showQRScanner}
                onClose={() => setShowQRScanner(false)}
                onQRScanned={handleQRScanned}
            />

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                amount={scannedAmount}
                walletBalance={walletBalance}
                onPaymentComplete={handlePaymentComplete}
                qrData={qrData}
            />

            {/* Payment Success Modal */}
            <PaymentSuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    setShowPayment(false);
                    setScannedAmount(0);
                }}
                amount={transactionData.amount}
                transactionId={transactionData.transactionId}
                method={transactionData.method}
                date={transactionData.date}
            />
        </div>
    );
}
