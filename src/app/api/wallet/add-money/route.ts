import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { message: "Invalid amount" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "default_secret_key_change_me"
        );

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        // Update user wallet balance
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: {
                walletBalance: { increment: amount },
            },
        });

        return NextResponse.json({
            message: "Money added successfully",
            newBalance: updatedUser.walletBalance,
        });
    } catch (error) {
        console.error("Error adding money:", error);
        return NextResponse.json(
            { message: "Failed to add money" },
            { status: 500 }
        );
    }
}
