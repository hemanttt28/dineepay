import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma"; // Make sure this path is correct based on other files
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { pin } = await req.json();

        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return NextResponse.json(
                { message: "PIN must be a 4-digit number" },
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
        const userId = payload.userId as string; // Check jwt payload structure in prisma schema or login route if available

        // Update user PIN
        await prisma.user.update({
            where: { userId }, // Assuming userId is unique or primary key field used for lookup
            data: { walletPin: pin },
        });

        return NextResponse.json({ message: "Wallet PIN updated successfully" });
    } catch (error) {
        console.error("Error updating PIN:", error);
        return NextResponse.json(
            { message: "Failed to update PIN" },
            { status: 500 }
        );
    }
}
