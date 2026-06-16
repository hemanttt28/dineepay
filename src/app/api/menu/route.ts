import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all menu items
export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch menu items" },
            { status: 500 }
        );
    }
}

// POST: Add a new menu item
export async function POST(req: Request) {
    try {
        const { name, price, category, image } = await req.json();

        if (!name || !price || !category) {
            return NextResponse.json(
                { message: "Name, price, and category are required" },
                { status: 400 }
            );
        }

        const newItem = await prisma.menuItem.create({
            data: {
                name,
                price: parseFloat(price),
                category,
                image: image || "",
            },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create menu item" },
            { status: 500 }
        );
    }
}

// PUT: Update a menu item
export async function PUT(req: Request) {
    try {
        const { id, name, price, category, image, available } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Item ID is required" },
                { status: 400 }
            );
        }

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                category,
                image,
                available,
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update menu item" },
            { status: 500 }
        );
    }
}

// DELETE: Remove a menu item
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Item ID is required" },
                { status: 400 }
            );
        }

        await prisma.menuItem.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete menu item" },
            { status: 500 }
        );
    }
}
