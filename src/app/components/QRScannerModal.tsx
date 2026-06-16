"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Camera, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQRScanned: (data: { amount: number; merchantId: string; orderId: string }) => void;
}

export default function QRScannerModal({
    isOpen,
    onClose,
    onQRScanned,
}: QRScannerModalProps) {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");

    useEffect(() => {
        if (isOpen) {
            checkCameraPermission();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isOpen]);

    const checkCameraPermission = async () => {
        try {
            const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
            setCameraPermission(result.state as "granted" | "denied" | "prompt");
        } catch (err) {
            console.log("Permission API not supported");
        }
    };

    const handleStartScan = () => {
        setScanning(true);
        setError("");
        setSuccess(false);
    };

    useEffect(() => {
        let ismounted = true;

        const initScanner = async () => {
            // Only run if scanning is true and no scanner instance exists
            if (!scanning || scannerRef.current) return;

            // Ensure DOM is ready (increased delay to prevent black screen)
            await new Promise(resolve => setTimeout(resolve, 300));

            if (!ismounted) return;

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter(device => device.kind === 'videoinput');

                if (cameras.length === 0) {
                    setError("No camera detected. Please use Upload option.");
                    setScanning(false);
                    return;
                }

                // Double check cleanup
                if (scannerRef.current) {
                    try { await (scannerRef.current as Html5Qrcode).clear(); } catch (e) { }
                }

                const html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                };

                try {
                    // Try environment camera first
                    await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
                } catch (err) {
                    console.warn("Environment camera failed, trying user camera...", err);
                    // Fallback to user camera (fix for desktops/laptops)
                    try {
                        await html5QrCode.start({ facingMode: "user" }, config, onScanSuccess, onScanFailure);
                    } catch (err2) {
                        throw err2; // Both failed
                    }
                }

            } catch (err: any) {
                console.error("Scanner init error:", err);
                if (ismounted) {
                    setError("Failed to start camera. Please ensure permissions are granted.");
                    setScanning(false);
                    scannerRef.current = null;
                }
            }
        };

        initScanner();

        return () => {
            ismounted = false;
        };
    }, [scanning]);


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setSuccess(false);

        // Reset file input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        const html5QrCode = new Html5Qrcode("js-qr-file-reader");

        try {
            // Second argument false = don't render the image to the div
            const decodedText = await html5QrCode.scanFile(file, false);
            onScanSuccess(decodedText);
        } catch (err: any) {
            // Log as warning to avoid Next.js error overlay
            console.warn("QR Scan Warning:", err);

            if (err?.toString().includes("No MultiFormat Readers")) {
                setError("No QR code found. Please try a clearer image or crop close to the QR.");
            } else {
                setError("Failed to read image. Please try another file.");
            }
        } finally {
            // Critical: Clear the instance to prevent "Instance with id already exists" error next time
            try {
                await html5QrCode.clear();
            } catch (e) {
                // Ignore clear errors
            }
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                // Check if is scanning
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
            scannerRef.current = null;
        }
        setScanning(false);
    };

    const onScanSuccess = (decodedText: string) => {
        try {
            let parsedData = { amount: 0, merchantId: "", orderId: "" };

            // specific check for UPI QR codes
            const isUPI = decodedText.startsWith("upi://");

            if (isUPI) {
                try {
                    const url = new URL(decodedText);
                    const params = new URLSearchParams(url.search);

                    const pa = params.get("pa"); // Payee Address (VPA)
                    const am = params.get("am"); // Amount
                    const tr = params.get("tr"); // Transaction Ref ID

                    if (!pa) {
                        setError("Invalid UPI QR code. Payee address missing.");
                        stopScanner();
                        return;
                    }

                    parsedData = {
                        amount: am ? parseFloat(am) : 0,
                        merchantId: pa,
                        orderId: tr || `UPI${Date.now()}`
                    };
                } catch (e) {
                    setError("Invalid UPI QR format");
                    stopScanner();
                    return;
                }
            } else {
                // Try parsing as JSON
                const qrData = JSON.parse(decodedText);

                if (!qrData.amount || !qrData.merchantId) {
                    setError("Invalid QR code format");
                    stopScanner();
                    return;
                }

                parsedData = {
                    amount: parseFloat(qrData.amount),
                    merchantId: qrData.merchantId,
                    orderId: qrData.orderId || `ORD${Date.now()}`
                };
            }

            setSuccess(true);
            stopScanner();

            // Delay to show success animation
            setTimeout(() => {
                onQRScanned(parsedData);
                handleClose();
            }, 1000);

        } catch (err) {
            console.error("QR Parse error:", err);
            setError("Invalid QR code. Please scan a valid Dine ePay or UPI QR code.");
            stopScanner();
        }
    };

    const onScanFailure = (error: string) => {
        // Ignore continuous scan failures (normal behavior)
    };

    const handleClose = () => {
        stopScanner();
        setSuccess(false);
        setError("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className="bg-linear-to-r from-[#ff6b00] to-[#ff8c42] p-6 text-white relative">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <QrCode className="w-8 h-8" />
                                    <div>
                                        <h2 className="text-2xl font-black">Scan QR Code</h2>
                                        <p className="text-white/90 text-sm">Point camera at payment QR</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scanner Area */}
                            <div className="p-6">
                                {!scanning && !success && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center"
                                    >
                                        <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                                            <Camera className="w-24 h-24 text-gray-400" />
                                        </div>
                                        <button
                                            onClick={handleStartScan}
                                            className="w-full py-4 btn-primary-3d text-lg flex items-center justify-center gap-2 mb-3"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Start Camera
                                        </button>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <ImageIcon className="w-5 h-5" />
                                            Upload from Gallery
                                        </button>

                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            Allow camera access or upload an image
                                        </p>
                                        <div id="js-qr-file-reader" className="hidden"></div>
                                    </motion.div>
                                )}

                                {scanning && !success && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="relative"
                                    >
                                        <div
                                            id="qr-reader"
                                            className="rounded-2xl overflow-hidden border-4 border-orange-500 w-full min-h-[300px]"
                                        />
                                        <div className="mt-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span className="font-semibold">Camera Active</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Position the QR code within the frame
                                            </p>
                                            <button
                                                onClick={stopScanner}
                                                className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold transition-colors"
                                            >
                                                Cancel Scan
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                        >
                                            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            QR Code Scanned!
                                        </h3>
                                        <p className="text-gray-600">Processing payment...</p>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-red-800 font-semibold text-sm">{error}</p>
                                            {cameraPermission === "denied" && (
                                                <p className="text-red-600 text-xs mt-1">
                                                    Please enable camera access in your browser settings.
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
