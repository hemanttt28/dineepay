import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, qrData } =
            await req.json();

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment Verified - Update order with payment details
            const updateData: any = {
                status: "COMPLETED",
                paymentId: razorpay_payment_id,
            };

            // If QR data exists, update metadata
            if (qrData) {
                const existingOrder = await prisma.order.findUnique({
                    where: { id: razorpay_order_id },
                });

                const metadata = existingOrder?.metadata
                    ? JSON.parse(existingOrder.metadata as string)
                    : {};

                updateData.metadata = JSON.stringify({
                    ...metadata,
                    merchantId: qrData.merchantId,
                    qrOrderId: qrData.orderId,
                    paymentSource: "qr_scanner",
                    verifiedAt: new Date().toISOString(),
                });
            }

            const updatedOrder = await prisma.order.update({
                where: { id: razorpay_order_id },
                data: updateData,
            });

            // Check if this is a wallet recharge
            const items = JSON.parse(updatedOrder.items);
            const isWalletRecharge = items.some((item: any) => item.name === "Wallet Recharge");

            let newBalance = null;

            if (isWalletRecharge) {
                // Get user from token
                const cookieStore = await cookies();
                const token = cookieStore.get("token")?.value;

                if (token) {
                    try {
                        const secret = new TextEncoder().encode(
                            process.env.JWT_SECRET || "default_secret_key_change_me"
                        );
                        const { payload } = await jwtVerify(token, secret);
                        const userId = payload.userId as string;

                        // Update wallet balance
                        const updatedUser = await prisma.user.update({
                            where: { userId },
                            data: {
                                walletBalance: { increment: updatedOrder.totalAmount },
                            },
                        });

                        newBalance = updatedUser.walletBalance;
                    } catch (error) {
                        console.error("Error updating wallet balance:", error);
                    }
                }
            }

            return NextResponse.json({
                message: "Payment verified successfully",
                qrData: qrData || null,
                newBalance: newBalance,
            });
        } else {
            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
