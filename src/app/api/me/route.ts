import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"; // Requires Next.js 13+ app dir

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies(); // Use cookies() in async server component/route
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "default_secret_key_change_me"
        );

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const user = await prisma.user.findUnique({
            where: { userId },
            select: { userId: true, role: true, walletBalance: true, collegeName: true, collegeId: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
