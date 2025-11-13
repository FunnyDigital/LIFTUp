# Subscription Payment Implementation

## Overview
This document explains the subscription payment system implemented in LiftUp using Paystack.

## Features Implemented

### 1. Onboarding Summary Screen Enhancement
- **Location**: `src/screens/onboarding/OnboardingSummaryScreen.tsx`
- **New Features**:
  - Subscription pricing card showing ₦1,000/month
  - List of subscription benefits
  - "Proceed to Payment" button
  - Paystack WebView integration

### 2. Payment Service
- **Location**: `src/services/paymentService.ts`
- **Functionality**:
  - Paystack public key management
  - Subscription amount calculation (in kobo and Naira)
  - End date calculation for subscriptions
  - Subscription saving to Firestore
  - Payment verification (needs backend implementation)
  - Subscription activation after successful payment

### 3. Payment Flow

```
User completes onboarding
    ↓
Views personalized plan summary
    ↓
Sees subscription card (₦1,000/month)
    ↓
Clicks "Proceed to Payment"
    ↓
Paystack WebView opens
    ↓
User selects payment method (Card/Bank/USSD/Transfer)
    ↓
Completes payment
    ↓
Payment successful → Subscription activated
    ↓
Onboarding complete → User enters app
```

## Subscription Structure

### Firestore Data
```typescript
users/{userId}/
  subscription: {
    plan: "monthly",
    amount: 1000,
    startDate: Timestamp,
    endDate: Timestamp,
    status: "active" | "expired" | "cancelled",
    paystackReference: "ref_xxxxx",
    updatedAt: Timestamp
  }
  subscriptionStatus: "active"
```

### Subscription Plans
- **Monthly**: ₦1,000/month (100,000 kobo)
- **Quarterly**: ₦2,700/3 months (10% discount) - Not shown in UI yet
- **Yearly**: ₦9,600/year (20% discount) - Not shown in UI yet

## Payment Methods Supported
- 💳 **Debit/Credit Cards** (Visa, Mastercard, Verve)
- 🏦 **Bank Transfer**
- 📱 **USSD**
- 🏪 **Internet Banking**

## Setup Required

### 1. Paystack Account
1. Create account at https://dashboard.paystack.com/
2. Get your public key from Settings → API Keys
3. Update `src/services/paymentService.ts`:
   ```typescript
   private paystackPublicKey = 'pk_test_your_actual_key_here';
   ```

### 2. Test Payment
Use these test card details in test mode:
- **Card Number**: 4084 0840 8408 4081
- **Expiry**: Any future date
- **CVV**: 408

### 3. Production Checklist
- [ ] Replace test key with live key
- [ ] Implement server-side payment verification
- [ ] Set up webhook endpoints
- [ ] Test all payment methods
- [ ] Configure Firestore security rules for subscriptions

## Key Functions

### `handleProceedToPayment()`
Triggers the Paystack payment WebView when user clicks the payment button.

### `handlePaymentSuccess(response)`
Called when payment is successful:
1. Activates the subscription
2. Saves subscription to Firestore
3. Completes onboarding
4. Shows success alert

### `handlePaymentCancel()`
Called when user cancels payment:
- Shows friendly message
- User can try again later from profile

### `paymentService.activateSubscription()`
Main function to activate a subscription:
1. Verifies payment with Paystack
2. Calculates subscription dates
3. Saves to Firestore
4. Updates user's subscription status

## UI Components

### Subscription Card
```
💳 Monthly Subscription
₦1,000/month
Unlock your personalized workout and diet plans

✓ Personalized workout plans
✓ Nigerian-tailored diet plans
✓ Progress tracking
✓ Expert fitness guidance

[Proceed to Payment Button]
🔒 Secure payment via Paystack
```

## Security Notes

### ✅ Safe Practices
- Public key exposed in client code (this is fine)
- Payment processing handled by Paystack
- Subscription status stored in Firestore

### ⚠️ Important for Production
- **MUST** verify payments on backend
- Never trust client-side verification
- Implement webhook handlers
- Use HTTPS for all API calls
- Rate limit payment attempts

## Testing Checklist

- [ ] Complete onboarding flow
- [ ] View subscription card on summary screen
- [ ] Click "Proceed to Payment"
- [ ] Test card payment
- [ ] Test bank transfer
- [ ] Test USSD
- [ ] Verify subscription saved to Firestore
- [ ] Confirm onboarding completes
- [ ] Check user has access to app features

## Future Enhancements

1. **Multiple Plan Options**
   - Add quarterly and yearly plans to UI
   - Show savings comparison

2. **Subscription Management**
   - View subscription in profile
   - Cancel subscription
   - Renew subscription
   - Payment history

3. **Free Trial**
   - Offer 7-day free trial
   - Auto-charge after trial ends

4. **Promo Codes**
   - Implement discount codes
   - Special offers for new users

5. **Payment Reminders**
   - Email before expiry
   - Push notifications
   - Grace period handling

## Troubleshooting

### Payment fails
- Check internet connection
- Verify Paystack key is correct
- Ensure card has sufficient funds
- Try different payment method

### Subscription not activating
- Check Firestore security rules
- Verify user is logged in
- Check console for error messages
- Ensure payment reference is valid

### WebView not opening
- Check react-native-paystack-webview installation
- Verify user email is set
- Check paystackWebViewRef is initialized

## Support

For Paystack-related issues:
- Documentation: https://paystack.com/docs/
- Support: https://paystack.com/contact
- Status: https://status.paystack.com/

For app-specific issues:
- Check Firebase console for errors
- Review Firestore security rules
- Check app logs for payment flow
