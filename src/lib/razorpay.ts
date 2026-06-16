import Razorpay from "razorpay";

// Lazy initialization — avoids crashing during Next.js build-time
// when RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set in CI.
let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (!_razorpay) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            throw new Error(
                "Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
            );
        }

        _razorpay = new Razorpay({ key_id, key_secret });
    }
    return _razorpay;
}

// Keep named export for backwards compatibility (used lazily now)
export const razorpay = {
    orders: {
        create: (opts: Parameters<Razorpay["orders"]["create"]>[0]) =>
            getRazorpay().orders.create(opts),
    },
};
