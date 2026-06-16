import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
    }
}

// UPDATE order status
export async function PUT(req: Request) {
    try {
        const { id, status } = await req.json();
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ message: "Error updating order" }, { status: 500 });
    }
}
