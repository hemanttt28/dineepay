import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all registered canteens (CANTEEN role users)
export async function GET() {
    try {
        const canteens = await prisma.user.findMany({
            where: { role: "CANTEEN" },
            select: {
                collegeName: true,
                collegeId: true,
                userId: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(canteens);
    } catch (error) {
        console.error("Error fetching canteens:", error);
        return NextResponse.json(
            { message: "Failed to fetch canteens" },
            { status: 500 }
        );
    }
}
