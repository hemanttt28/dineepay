# QR Scanner + Razorpay Integration - Quick Reference

## 🔄 Complete Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Scan QR & Pay] Button                                   │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QR SCANNER MODAL                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📷 Camera View  OR  🎯 Demo Scan (₹250)                 │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │ Scans QR Code                            │
│                       │ Extracts: amount, merchantId, orderId    │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PAYMENT METHOD MODAL                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amount: ₹250 (from QR)                                   │  │
│  │  Merchant: MERCHANT_001                                   │  │
│  │  Order: ORD1234567890                                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  💳 Wallet (PIN)                                          │  │
│  │  📱 UPI (Razorpay)                                        │  │
│  │  💰 Card / Online (Razorpay)                              │  │
│  └────────┬─────────────────────┬────────────────────────────┘  │
└───────────┼─────────────────────┼─────────────────────────────────┘
            │                     │
    ┌───────▼──────┐      ┌──────▼──────────┐
    │ WALLET PIN   │      │   RAZORPAY      │
    │   PAYMENT    │      │   CHECKOUT      │
    └───────┬──────┘      └──────┬──────────┘
            │                    │
            │                    │ QR Data in Notes:
            │                    │ - merchant_id
            │                    │ - qr_order_id
            │                    │ - payment_source: "qr_scanner"
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/create-order                                        │  │
│  │  - Creates Razorpay order with QR data                    │  │
│  │  - Stores order in DB with metadata                       │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │  /api/verify-payment                                      │  │
│  │  - Verifies Razorpay signature                            │  │
│  │  - Updates order status to COMPLETED                      │  │
│  │  - Saves paymentId and QR metadata                        │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Order Table:                                             │  │
│  │  - id: "order_abc123"                                     │  │
│  │  - totalAmount: 250                                       │  │
│  │  - status: "COMPLETED"                                    │  │
│  │  - paymentId: "pay_xyz789"                                │  │
│  │  - metadata: {                                            │  │
│  │      merchantId: "MERCHANT_001",                          │  │
│  │      qrOrderId: "ORD1234567890",                          │  │
│  │      paymentSource: "qr_scanner",                         │  │
│  │      verifiedAt: "2026-02-14T02:48:54Z"                   │  │
│  │    }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PAYMENT SUCCESS MODAL                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ✅ Payment Successful!                                   │  │
│  │  Amount: ₹250                                             │  │
│  │  Transaction ID: TXN123456                                │  │
│  │  Method: UPI / Card / Wallet                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### QR Code Data Structure:
```json
{
  "amount": 250,
  "merchantId": "MERCHANT_001",
  "orderId": "ORD1234567890"
}
```

### Razorpay Order (with QR data):
```json
{
  "id": "order_abc123",
  "amount": 25000,
  "currency": "INR",
  "receipt": "ORD1234567890",
  "notes": {
    "merchant_id": "MERCHANT_001",
    "qr_order_id": "ORD1234567890",
    "payment_source": "qr_scanner"
  }
}
```

### Database Order Record:
```json
{
  "id": "order_abc123",
  "totalAmount": 250,
  "status": "COMPLETED",
  "items": "[{\"name\":\"QR Order ORD1234567890\",\"quantity\":1,\"price\":250}]",
  "paymentId": "pay_xyz789",
  "metadata": "{\"merchantId\":\"MERCHANT_001\",\"qrOrderId\":\"ORD1234567890\",\"paymentSource\":\"qr_scanner\",\"verifiedAt\":\"2026-02-14T02:48:54Z\"}",
  "createdAt": "2026-02-14T02:48:54Z",
  "updatedAt": "2026-02-14T02:49:10Z"
}
```

---

## 🎯 Key Integration Points

### 1. Frontend → Backend
```typescript
// PaymentMethodModal.tsx
const res = await fetch("/api/create-order", {
    method: "POST",
    body: JSON.stringify({
        amount: amount,
        items: orderItems,
        qrData: qrData  // ← QR data passed here
    })
});
```

### 2. Backend → Razorpay
```typescript
// create-order/route.ts
const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: qrData?.orderId || `order_${Date.now()}`,
    notes: {  // ← QR data in notes
        merchant_id: qrData.merchantId,
        qr_order_id: qrData.orderId,
        payment_source: "qr_scanner"
    }
});
```

### 3. Backend → Database
```typescript
// create-order/route.ts
const orderData = {
    id: order.id,
    totalAmount: amount,
    items: JSON.stringify(items),
    status: "PENDING",
    metadata: JSON.stringify({  // ← QR data stored
        merchantId: qrData.merchantId,
        qrOrderId: qrData.orderId,
        paymentSource: "qr_scanner"
    })
};
```

---

## 🔑 Key Files Modified

| File | Purpose | Changes |
|------|---------|---------|
| `PaymentMethodModal.tsx` | Payment UI | Added qrData prop, pass to Razorpay |
| `student/dashboard/page.tsx` | Student page | Pass qrData to payment modal |
| `api/create-order/route.ts` | Create orders | Accept & store QR data |
| `api/verify-payment/route.ts` | Verify payments | Update metadata with QR data |
| `prisma/schema.prisma` | Database schema | Added paymentId & metadata fields |

---

## ✅ Testing Checklist

- [ ] QR Scanner opens and scans code
- [ ] Payment modal shows correct amount from QR
- [ ] Wallet payment works with PIN
- [ ] UPI payment opens Razorpay with QR data
- [ ] Card payment opens Razorpay with QR data
- [ ] Razorpay order has QR data in notes
- [ ] Payment verification succeeds
- [ ] Database stores QR metadata
- [ ] Success modal shows transaction details

---

## 🚨 Important: Database Migration

**Before testing, you MUST update the database schema:**

```bash
# Stop the dev server (Ctrl+C in terminal)
npx prisma db push
# Restart dev server
npm run dev
```

This adds the `paymentId` and `metadata` fields to the Order table.

---

## 🎉 Result

**Complete QR-to-Payment Integration:**
- ✅ Scan QR codes
- ✅ Pay with Razorpay (UPI/Card) or Wallet (PIN)
- ✅ Track QR payments in Razorpay
- ✅ Store merchant & order data
- ✅ Full payment reconciliation support
