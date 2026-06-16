"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Download } from "lucide-react";
import QRCode from "qrcode";

export default function QRGeneratorPage() {
    const [amount, setAmount] = useState("250");
    const [merchantId, setMerchantId] = useState("MERCHANT_001");
    const [orderId, setOrderId] = useState(`ORD${Date.now()}`);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const generateQRCode = async () => {
        const qrData = {
            amount: parseFloat(amount),
            merchantId,
            orderId,
        };

        try {
            const url = await QRCode.toDataURL(JSON.stringify(qrData), {
                width: 400,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });
            setQrCodeUrl(url);
        } catch (err) {
            console.error("Error generating QR code:", err);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement("a");
        link.href = qrCodeUrl;
        link.download = `payment-qr-${orderId}.png`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <QrCode className="w-12 h-12 text-orange-600" />
                        <h1 className="text-4xl font-black text-gray-900">
                            Payment QR Generator
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Generate QR codes for testing the student payment scanner
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Payment Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Merchant ID
                                </label>
                                <input
                                    type="text"
                                    value={merchantId}
                                    onChange={(e) => setMerchantId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                    placeholder="Enter merchant ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Order ID
                                </label>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                    placeholder="Enter order ID"
                                />
                            </div>

                            <button
                                onClick={generateQRCode}
                                className="w-full py-4 btn-primary-3d text-lg flex items-center justify-center gap-2"
                            >
                                <QrCode className="w-5 h-5" />
                                Generate QR Code
                            </button>
                        </div>
                    </motion.div>

                    {/* QR Code Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Generated QR Code
                        </h2>

                        {qrCodeUrl ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
                                    <img
                                        src={qrCodeUrl}
                                        alt="Payment QR Code"
                                        className="w-full max-w-sm"
                                    />
                                </div>

                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                        Payment Amount
                                    </p>
                                    <p className="text-3xl font-black text-orange-600">
                                        ₹{amount}
                                    </p>
                                </div>

                                <button
                                    onClick={downloadQRCode}
                                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download QR Code
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <QrCode className="w-24 h-24 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">
                                        QR code will appear here
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-3xl p-8 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        How to Test
                    </h2>
                    <ol className="space-y-3 text-gray-700">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </span>
                            <span>
                                Enter the payment amount and generate a QR code
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </span>
                            <span>
                                Go to the student dashboard and click "Scan QR & Pay"
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </span>
                            <span>
                                Either scan the QR code with your camera or use "Demo Scan"
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                4
                            </span>
                            <span>
                                Enter your 4-digit PIN (default: 1234) to complete payment
                            </span>
                        </li>
                    </ol>
                </motion.div>
            </div>
        </div>
    );
}
