import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Paths to protect
    const isCanteenPath = pathname.startsWith("/dashboard");
    const isStudentPath = pathname.startsWith("/student/dashboard");

    // Allow access to login, register, public assets, and API routes (APIs handle their own auth if needed)
    if (!isCanteenPath && !isStudentPath) {
        return NextResponse.next();
    }

    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || "default_secret_key_change_me"
        );

        const { payload } = await jwtVerify(token, secret);
        const role = payload.role as string;

        // RBAC Logic
        if (isCanteenPath && role !== "CANTEEN" && role !== "ADMIN") {
            // Student trying to access Canteen Dashboard
            return NextResponse.redirect(new URL("/student/dashboard", request.url));
        }

        if (isStudentPath && role !== "STUDENT") {
            // Canteen manager trying to access Student Dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Token valid failed
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/student/dashboard/:path*"],
};
