import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all menu items
export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: { category: "asc" },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching menu" }, { status: 500 });
    }
}

// ADD menu item
export async function POST(req: Request) {
    try {
        const { name, price, category, image, available } = await req.json();
        const newItem = await prisma.menuItem.create({
            data: {
                name,
                price: parseFloat(price),
                category,
                image,
                available: available ?? true,
            },
        });
        return NextResponse.json(newItem);
    } catch (error) {
        console.error("Menu Add Error:", error);
        return NextResponse.json({ message: "Error adding item" }, { status: 500 });
    }
}

// DELETE menu item
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID required" }, { status: 400 });
        }

        await prisma.menuItem.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting item" }, { status: 500 });
    }
}
