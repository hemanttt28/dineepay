import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Parse items JSON for frontend
        const formattedOrders = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items)
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

// PUT: Update order status
export async function PUT(req: Request) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json(
                { message: "Order ID and status are required" },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update order status" },
            { status: 500 }
        );
    }
}
