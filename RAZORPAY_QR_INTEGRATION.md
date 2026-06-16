# QR Scanner + Razorpay Integration Guide

## ✅ Integration Complete!

The QR scanner is now fully integrated with Razorpay! Students can scan QR codes and pay using **any Razorpay payment method** (UPI, Cards, Net Banking, Wallets) in addition to the PIN-based wallet payment.

---

## 🔄 How It Works

### Complete Payment Flow:

```
1. Student clicks "Scan QR & Pay"
   ↓
2. QR Scanner opens (camera or demo mode)
   ↓
3. QR code is scanned containing:
   - amount
   - merchantId
   - orderId
   ↓
4. Payment Method Modal opens with 3 options:
   - 💳 Wallet (PIN-based)
   - 📱 UPI (Razorpay)
   - 💰 Card / Online (Razorpay)
   ↓
5. Student selects payment method:
   
   IF WALLET:
   - Enter 4-digit PIN (1234)
   - Payment processed via wallet API
   
   IF UPI or CARD:
   - Razorpay checkout opens
   - QR data is attached to payment
   - Student completes payment
   - Payment verified with signature
   ↓
6. Payment Success Modal shows confirmation
   ↓
7. Order saved in database with QR metadata
```

---

## 🎯 Key Features Implemented

### 1. **QR Data Propagation**
- QR scanner extracts: `amount`, `merchantId`, `orderId`
- Data flows through: Scanner → Dashboard → Payment Modal → Razorpay → Backend
- Stored in database for tracking and analytics

### 2. **Razorpay Integration**
- **Order Creation**: QR data added to Razorpay order notes
- **Payment Description**: Shows merchant and order info
- **Receipt**: Uses QR orderId as receipt number
- **Metadata**: QR info stored in Razorpay notes for reconciliation

### 3. **Database Tracking**
- Orders table enhanced with:
  - `paymentId`: Razorpay payment ID
  - `metadata`: JSON with QR scanner data
- Enables tracking of QR vs manual payments
- Merchant reconciliation support

---

## 📝 Code Changes Summary

### Frontend Changes:

#### 1. **PaymentMethodModal.tsx**
```typescript
// Added qrData prop
interface PaymentMethodModalProps {
    qrData?: { merchantId: string; orderId: string } | null;
}

// Enhanced Razorpay order creation
const orderDescription = qrData 
    ? `QR Payment - Merchant: ${qrData.merchantId}, Order: ${qrData.orderId}`
    : "Canteen Payment";

// Added QR data to Razorpay notes
notes: {
    merchant_id: qrData.merchantId,
    qr_order_id: qrData.orderId,
    payment_source: "qr_scanner"
}
```

#### 2. **Student Dashboard**
```typescript
// Pass QR data to payment modal
<PaymentMethodModal
    qrData={qrData}
    // ... other props
/>
```

### Backend Changes:

#### 3. **create-order API**
```typescript
// Accept QR data
const { amount, items, qrData } = await req.json();

// Add to Razorpay order
const order = await razorpay.orders.create({
    receipt: qrData?.orderId || `order_${Date.now()}`,
    notes: {
        merchant_id: qrData.merchantId,
        qr_order_id: qrData.orderId,
        payment_source: "qr_scanner"
    }
});

// Store in database
orderData.metadata = JSON.stringify({
    merchantId: qrData.merchantId,
    qrOrderId: qrData.orderId,
    paymentSource: "qr_scanner"
});
```

#### 4. **verify-payment API**
```typescript
// Accept QR data in verification
const { razorpay_order_id, razorpay_payment_id, razorpay_signature, qrData } = await req.json();

// Update order with payment details and QR metadata
updateData.metadata = JSON.stringify({
    merchantId: qrData.merchantId,
    qrOrderId: qrData.orderId,
    paymentSource: "qr_scanner",
    verifiedAt: new Date().toISOString()
});
```

#### 5. **Prisma Schema**
```prisma
model Order {
  id          String   @id @default(uuid())
  totalAmount Float
  status      String   @default("PENDING")
  items       String
  paymentId   String?  // NEW: Razorpay payment ID
  metadata    String?  // NEW: QR data and other metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🧪 Testing the Integration

### Test Scenario 1: QR + Wallet PIN
```
1. Generate QR code at /qr-generator (₹150)
2. Student dashboard → "Scan QR & Pay"
3. Demo Scan (₹250) or scan real QR
4. Select "Wallet"
5. Enter PIN: 1234
6. ✅ Payment Success
```

### Test Scenario 2: QR + Razorpay UPI
```
1. Generate QR code at /qr-generator (₹200)
2. Student dashboard → "Scan QR & Pay"
3. Scan QR code
4. Select "UPI"
5. Razorpay opens with:
   - Description: "QR Payment - Merchant: MERCHANT_001, Order: ORD123"
   - Amount: ₹200
   - Notes: merchant_id, qr_order_id, payment_source
6. Complete UPI payment
7. ✅ Payment verified and stored with QR metadata
```

### Test Scenario 3: QR + Razorpay Card
```
1. Generate QR code at /qr-generator (₹300)
2. Student dashboard → "Scan QR & Pay"
3. Scan QR code
4. Select "Card / Online"
5. Razorpay opens with QR data in notes
6. Enter card details
7. ✅ Payment verified with QR tracking
```

---

## 📊 Database Schema Update Required

**IMPORTANT**: You need to apply the Prisma migration to add the new fields.

### Option 1: Stop dev server and migrate
```bash
# Stop the dev server (Ctrl+C)
npx prisma migrate dev --name add_qr_metadata
npm run dev
```

### Option 2: Push schema directly
```bash
# Stop the dev server (Ctrl+C)
npx prisma db push
npm run dev
```

The migration adds:
- `paymentId` field to store Razorpay payment IDs
- `metadata` field to store QR scanner data as JSON

---

## 🔍 Tracking QR Payments

### In Razorpay Dashboard:
- Check order notes for `merchant_id`, `qr_order_id`, `payment_source`
- Filter payments by `payment_source: "qr_scanner"`
- Reconcile with merchant orders using `qr_order_id`

### In Your Database:
```sql
-- Get all QR scanner payments
SELECT * FROM Order 
WHERE metadata LIKE '%qr_scanner%';

-- Get payments for specific merchant
SELECT * FROM Order 
WHERE metadata LIKE '%MERCHANT_001%';

-- Get specific QR order
SELECT * FROM Order 
WHERE metadata LIKE '%ORD123%';
```

---

## 🎁 Benefits of This Integration

### For Students:
✅ Scan QR and pay with any method (UPI, Card, Wallet)  
✅ Seamless Razorpay checkout experience  
✅ Multiple payment options  
✅ Instant payment confirmation  

### For Merchants:
✅ Track QR payments separately  
✅ Reconcile with Razorpay using order notes  
✅ Identify payment source (QR vs manual)  
✅ Link payments to specific orders  

### For Admin:
✅ Analytics on QR vs manual payments  
✅ Merchant-wise payment tracking  
✅ Complete payment audit trail  
✅ Razorpay integration for all payments  

---

## 🚀 What's Next?

### Immediate:
1. Stop dev server
2. Run Prisma migration
3. Restart dev server
4. Test QR + Razorpay flow

### Future Enhancements:
- [ ] QR payment analytics dashboard
- [ ] Merchant-specific QR codes
- [ ] QR code expiration
- [ ] Bulk QR generation
- [ ] Payment reconciliation reports
- [ ] Webhook integration for real-time updates

---

## 📞 Troubleshooting

### Issue: TypeScript errors about metadata/paymentId
**Solution**: Run Prisma migration to update the schema

### Issue: QR data not showing in Razorpay
**Solution**: Check Razorpay dashboard → Orders → Notes section

### Issue: Payment verification fails
**Solution**: Ensure qrData is passed in verify-payment API call

---

## ✨ Summary

**The QR scanner is now fully integrated with Razorpay!**

- ✅ QR codes contain merchant and order info
- ✅ Students can pay via Razorpay (UPI/Card) or Wallet (PIN)
- ✅ QR data flows through entire payment pipeline
- ✅ Razorpay orders tagged with QR metadata
- ✅ Database stores complete payment tracking info
- ✅ Ready for merchant reconciliation and analytics

**Next Step**: Apply the Prisma migration and test the complete flow!
