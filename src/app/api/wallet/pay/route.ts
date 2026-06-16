import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, amount, pin, items } = await req.json();
        console.log(`[WalletPay] Attempt: User=${userId}, Amount=${amount}, PIN=${pin ? '****' : 'none'}`);

        if (!userId || !amount || !pin) {
            console.log("[WalletPay] Missing fields");
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Fetch User
        const user = await prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 2. Verify PIN
        if (user.walletPin !== pin) {
            console.log("[WalletPay] Incorrect PIN");
            return NextResponse.json(
                { message: "Incorrect PIN" },
                { status: 401 }
            );
        }

        // 3. Check Balance
        if (user.walletBalance < amount) {
            return NextResponse.json(
                { message: "Insufficient wallet balance" },
                { status: 400 }
            );
        }

        // 4. Process Transaction (Atomic)
        const result = await prisma.$transaction(async (tx) => {
            // Deduct balance
            const updatedUser = await tx.user.update({
                where: { userId },
                data: {
                    walletBalance: { decrement: amount },
                },
            });

            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    totalAmount: amount,
                    status: "COMPLETED", // Instant payment
                    items: JSON.stringify(items || []),
                },
            });

            return { updatedUser, newOrder };
        });

        console.log(`[WalletPay] Success: Order=${result.newOrder.id}, NewBalance=${result.updatedUser.walletBalance}`);
        return NextResponse.json({
            message: "Payment successful",
            newBalance: result.updatedUser.walletBalance,
            orderId: result.newOrder.id,
        });

    } catch (error) {
        console.error("Wallet payment error:", error);
        return NextResponse.json(
            { message: "Payment processing failed" },
            { status: 500 }
        );
    }
}
