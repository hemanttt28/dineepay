import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const bodyParsed = await req.json();
        const { userId, password, role, collegeName } = bodyParsed;

        if (!userId || !password) {
            return NextResponse.json(
                { message: "User ID and password are required" },
                { status: 400 }
            );
        }

        if (role === "CANTEEN" && !collegeName) {
            return NextResponse.json(
                { message: "College Name is required for canteen" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { userId },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User ID already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate college ID if it's a canteen
        let collegeId = null;
        if (role === "CANTEEN") {
            const shortName = collegeName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "C");
            const ran = Math.floor(100 + Math.random() * 900);
            collegeId = `${shortName}-${ran}`;
        }

        // Create user
        await prisma.user.create({
            data: {
                userId,
                password: hashedPassword,
                role: role || "STUDENT",
                collegeName: role === "CANTEEN" ? collegeName : null,
                collegeId: collegeId
            },
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error: any) {
        // Use console.error only — fs writes crash Netlify serverless functions
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error: " + error.message },
            { status: 500 }
        );
    }
}
