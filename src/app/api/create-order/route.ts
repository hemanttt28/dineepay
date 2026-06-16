import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { amount, items, qrData } = await req.json();

        if (!amount || !items) {
            return NextResponse.json(
                { message: "Amount and items are required" },
                { status: 400 }
            );
        }

        // Create Razorpay Order with QR data in notes
        const orderNotes: any = {
            payment_source: qrData ? "qr_scanner" : "manual",
        };

        if (qrData) {
            orderNotes.merchant_id = qrData.merchantId;
            orderNotes.qr_order_id = qrData.orderId;
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in paisa
            currency: "INR",
            receipt: (qrData?.orderId || `order_${Date.now()}`).substring(0, 40),
            notes: orderNotes,
        });

        // Create Database Order (Status: PENDING) with QR data
        const orderData: any = {
            id: order.id, // Use Razorpay Order ID as DB ID for easy mapping
            totalAmount: amount,
            items: JSON.stringify(items),
            status: "PENDING",
        };

        // Add QR data to order if available
        if (qrData) {
            orderData.metadata = JSON.stringify({
                merchantId: qrData.merchantId,
                qrOrderId: qrData.orderId,
                paymentSource: "qr_scanner",
            });
        }

        const newOrder = await prisma.order.create({
            data: orderData,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            dbOrderId: newOrder.id,
            qrData: qrData || null,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { message: "Failed to create order" },
            { status: 500 }
        );
    }
}
