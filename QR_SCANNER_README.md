# QR Scanner Payment Feature

## Overview
The QR Scanner feature allows students to scan merchant QR codes and complete payments using their 4-digit PIN. This provides a quick and secure payment method for canteen transactions.

## Features

### 1. **QR Scanner Modal** (`QRScannerModal.tsx`)
- Real-time camera-based QR code scanning
- Camera permission handling
- QR code validation and parsing
- Success/error feedback animations
- Demo mode for testing without camera

### 2. **Student Dashboard Integration**
- New "Scan QR & Pay" quick action button
- Seamless integration with existing payment flow
- PIN-based authentication (4-digit)
- Transaction success confirmation

### 3. **QR Code Generator** (`/qr-generator`)
- Merchant-facing tool to generate payment QR codes
- Customizable amount, merchant ID, and order ID
- Download QR codes as PNG images
- Testing instructions included

## How It Works

### For Students:
1. Click "Scan QR & Pay" on the student dashboard
2. Allow camera access when prompted
3. Point camera at merchant's payment QR code
4. QR code is automatically scanned and validated
5. Payment modal opens with the scanned amount
6. Select payment method (Wallet recommended for PIN)
7. Enter 4-digit PIN (default: 1234)
8. Payment is processed and confirmed

### For Merchants:
1. Visit `/qr-generator` page
2. Enter payment amount and merchant details
3. Click "Generate QR Code"
4. Display or print QR code for students to scan
5. Students scan and pay instantly

## QR Code Format

The QR codes contain JSON data in the following format:

```json
{
  "amount": 250,
  "merchantId": "MERCHANT_001",
  "orderId": "ORD1234567890"
}
```

## Security Features

1. **PIN Authentication**: 4-digit PIN required for wallet payments
2. **QR Validation**: Only valid payment QR codes are accepted
3. **Secure Parsing**: JSON validation prevents malformed data
4. **Transaction IDs**: Unique transaction IDs for tracking

## Testing

### Option 1: Demo Mode (No Camera Required)
1. Open student dashboard
2. Click "Scan QR & Pay"
3. Click "Demo Scan (₹250)" button
4. Payment modal opens with ₹250
5. Complete payment with PIN: 1234

### Option 2: Real QR Scanning
1. Visit `/qr-generator` to create a test QR code
2. Generate QR code with desired amount
3. Display QR code on another device or print it
4. Use student dashboard scanner to scan
5. Complete payment with PIN: 1234

## Dependencies

- **html5-qrcode**: Camera-based QR code scanning
- **qrcode**: QR code generation
- **framer-motion**: Smooth animations
- **lucide-react**: Icons

## File Structure

```
src/app/
├── components/
│   ├── QRScannerModal.tsx       # QR scanner component
│   ├── PaymentMethodModal.tsx   # Payment selection with PIN
│   └── PaymentSuccessModal.tsx  # Success confirmation
├── student/
│   └── dashboard/
│       └── page.tsx              # Student dashboard with QR scanner
└── qr-generator/
    └── page.tsx                  # QR code generator for merchants
```

## Default PIN

The default wallet PIN is **1234**. This can be changed in the user's account settings.

## Future Enhancements

- [ ] Custom PIN setup during registration
- [ ] PIN reset functionality
- [ ] Transaction history with QR payment details
- [ ] Merchant dashboard to track QR payments
- [ ] Multiple QR code templates
- [ ] Bulk QR code generation
- [ ] Analytics for QR payment usage

## Troubleshooting

### Camera Not Working
- Ensure browser has camera permissions
- Check if camera is being used by another application
- Try using HTTPS (required for camera access)
- Use Demo Mode as fallback

### QR Code Not Scanning
- Ensure good lighting conditions
- Hold camera steady and at proper distance
- Verify QR code is not damaged or blurry
- Try Demo Mode to test payment flow

### Payment Failed
- Verify sufficient wallet balance
- Check if PIN is correct (default: 1234)
- Ensure stable internet connection
- Contact support if issue persists

## API Integration Points

The feature integrates with existing APIs:

1. **`/api/wallet/pay`**: Processes wallet payments with PIN
2. **`/api/me`**: Fetches user wallet balance
3. **`/api/create-order`**: Creates Razorpay orders (for card/UPI)
4. **`/api/verify-payment`**: Verifies Razorpay payments

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 11+)
- ⚠️ Older browsers may not support camera API

## Notes

- Camera access requires HTTPS in production
- QR codes are generated client-side for privacy
- PIN is transmitted securely to backend
- Demo mode is perfect for development/testing
