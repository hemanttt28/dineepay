
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { password, newPin } = await req.json();

        if (!password || !newPin) {
            return NextResponse.json(
                { message: "Password and new PIN are required" },
                { status: 400 }
            );
        }

        if (newPin.length !== 4 || isNaN(Number(newPin))) {
            return NextResponse.json(
                { message: "PIN must be a 4-digit number" },
                { status: 400 }
            );
        }

        // Verify Token
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

        // Fetch user
        const user = await prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify Password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { message: "Incorrect password" },
                { status: 401 }
            );
        }

        // Update PIN
        await prisma.user.update({
            where: { userId },
            data: { walletPin: newPin },
        });

        return NextResponse.json({ message: "Wallet PIN updated successfully" });

    } catch (error) {
        console.error("Reset PIN error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
