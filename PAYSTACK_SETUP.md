# Paystack Payment Integration Setup

## Overview
LiftUp uses Paystack for processing subscription payments in Nigeria.

## Setup Instructions

### 1. Get Your Paystack API Keys

1. Visit [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys & Webhooks**
4. Copy your **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for production)

### 2. Update the Payment Service

Open `src/services/paymentService.ts` and replace the placeholder key:

```typescript
private paystackPublicKey = 'pk_test_your_actual_key_here'; // Replace this
```

With your actual Paystack public key:

```typescript
private paystackPublicKey = 'pk_test_xxxxxxxxxxxxxxxxxxxxx';
```

### 3. Test Mode vs Production

- **Test Mode**: Use `pk_test_` keys for development and testing
  - Test cards: https://paystack.com/docs/payments/test-payments/
  - Common test card: `4084084084084081` (expires any future date, CVV: `408`)

- **Production Mode**: Use `pk_live_` keys when going live
  - Real transactions will be processed
  - Ensure your Paystack account is fully activated

### 4. Subscription Plans

Current pricing in the app:
- **Monthly**: ₦1,000/month

You can modify pricing in `src/services/paymentService.ts`:

```typescript
getSubscriptionAmount(plan: 'monthly' | 'quarterly' | 'yearly'): number {
  const prices = {
    monthly: 100000, // ₦1000 = 100000 kobo
    quarterly: 270000, // ₦2700 (10% discount)
    yearly: 960000, // ₦9600 (20% discount)
  };
  return prices[plan];
}
```

### 5. Payment Verification (IMPORTANT for Production)

For production, you **MUST** implement server-side payment verification:

1. Create a backend API endpoint
2. Use Paystack's verification API: `https://api.paystack.co/transaction/verify/:reference`
3. Update `paymentService.verifyPayment()` to call your backend

**Never trust client-side verification in production!**

### 6. Webhook Setup (Optional but Recommended)

Set up webhooks to handle subscription events:

1. In Paystack Dashboard, go to **Settings** → **API Keys & Webhooks**
2. Add your webhook URL: `https://your-backend.com/api/webhooks/paystack`
3. Handle these events:
   - `charge.success` - Payment successful
   - `subscription.create` - Subscription created
   - `subscription.disable` - Subscription cancelled

### 7. Testing Payment Flow

1. Complete the onboarding flow
2. On the summary screen, you'll see the subscription card
3. Click "Proceed to Payment"
4. Use test card details in test mode
5. Verify subscription is saved in Firestore

### 8. Firestore Structure

Subscriptions are saved in the user document:

```javascript
users/{userId}/
  subscription: {
    plan: "monthly",
    amount: 1000,
    startDate: Timestamp,
    endDate: Timestamp,
    status: "active",
    paystackReference: "ref_xxxxx",
    updatedAt: Timestamp
  }
  subscriptionStatus: "active"
```

### 9. Security Considerations

- ✅ Public keys are safe to expose in client code
- ❌ NEVER expose secret keys in client code
- ✅ Verify all payments on your backend
- ✅ Use HTTPS for all API calls
- ✅ Implement rate limiting
- ✅ Log all payment attempts

### 10. Support & Documentation

- [Paystack Documentation](https://paystack.com/docs/)
- [React Native Paystack WebView](https://github.com/just1and0/React-Native-Paystack-WebView)
- [Paystack Support](https://paystack.com/contact)

## Payment Channels Enabled

The app supports these payment methods:
- 💳 **Card** - Visa, Mastercard, Verve
- 🏦 **Bank Transfer** - Direct bank transfers
- 📱 **USSD** - Mobile banking codes
- 🏪 **Bank** - Pay with internet banking

## Next Steps

1. Replace the test public key with your actual key
2. Test the payment flow thoroughly
3. Set up server-side verification before going live
4. Configure webhooks for automated subscription management
5. Update pricing or add new plans as needed
