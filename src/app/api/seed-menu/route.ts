import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // Option to clear existing menu? Let's keep it safe and just add or upsert.
        // For a clean slate as per request, let's delete all and recreate.
        await prisma.menuItem.deleteMany({});

        const menuItems = [
            // Snacks
            { name: "Samosa", price: 20, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800" },
            { name: "Pav Vada", price: 20, category: "Snacks", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" }, // Generic food
            { name: "Vada Pav", price: 25, category: "Snacks", image: "https://images.unsplash.com/photo-1626132647323-999330a91599?w=800" },
            { name: "Sandwich", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800" },
            { name: "Kachori", price: 25, category: "Snacks", image: "https://images.unsplash.com/photo-1605333396915-47e9b068da6c?w=800" },
            { name: "Poha", price: 30, category: "Snacks", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800" }, // Generic
            { name: "Pav Bhaji", price: 100, category: "Snacks", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800" },
            { name: "Misal Pav", price: 80, category: "Snacks", image: "https://images.unsplash.com/photo-1626132647323-999330a91599?w=800" },

            // South Indian
            { name: "Idli", price: 40, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760574-d8162153b6aa?w=800" },
            { name: "Dosa", price: 60, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760574-d8162153b6aa?w=800" },
            { name: "Sambhar", price: 30, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760574-d8162153b6aa?w=800" },
            { name: "Medu Vada", price: 45, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760574-d8162153b6aa?w=800" },
            { name: "Mix Uttapam", price: 70, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760574-d8162153b6aa?w=800" },

            // Soft Drinks
            { name: "Cola", price: 20, category: "Soft Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800" },
            { name: "Lemonade", price: 20, category: "Soft Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800" },
            { name: "Orange Soda", price: 20, category: "Soft Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800" },

            // Ice Cream
            { name: "Vanilla", price: 30, category: "Ice Cream", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800" },
            { name: "Chocolate", price: 40, category: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800" },
            { name: "Strawberry", price: 35, category: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800" },

            // Dairy Product
            { name: "Lassi", price: 40, category: "Dairy Product", image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800" },
            { name: "Chaas", price: 20, category: "Dairy Product", image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800" },
            { name: "Milkshake", price: 60, category: "Dairy Product", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800" },
        ];

        for (const item of menuItems) {
            await prisma.menuItem.create({
                data: item,
            });
        }

        // Seed Users
        const hashedPassword = await bcrypt.hash("123456", 10);

        // Upsert Canteen Admin
        await prisma.user.upsert({
            where: { userId: "admin" },
            update: {},
            create: {
                userId: "admin",
                password: hashedPassword,
                role: "CANTEEN",
                walletBalance: 0,
                walletPin: "1234"
            }
        });

        // Upsert Student
        await prisma.user.upsert({
            where: { userId: "std01" },
            update: {},
            create: {
                userId: "std01",
                password: hashedPassword,
                role: "STUDENT",
                walletBalance: 1500,
                walletPin: "1234"
            }
        });

        return NextResponse.json({ message: "Menu seeded successfully", count: menuItems.length });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ message: "Failed to seed menu", error }, { status: 500 });
    }
}
