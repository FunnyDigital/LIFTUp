import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SubscriptionData {
  userId: string;
  plan: 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  paystackReference: string;
}

class PaymentService {
  // Paystack public key - replace with your actual key
  private paystackPublicKey = 'pk_test_019f033625483fdf933f93654941a531e6b14efc'; // TODO: Replace with actual key

  getPaystackPublicKey(): string {
    return this.paystackPublicKey;
  }

  // Calculate subscription end date
  calculateEndDate(plan: 'monthly' | 'quarterly' | 'yearly', startDate: Date = new Date()): Date {
    const endDate = new Date(startDate);
    
    switch (plan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate;
  }

  // Get subscription amount in kobo (Paystack uses kobo)
  getSubscriptionAmount(plan: 'monthly' | 'quarterly' | 'yearly'): number {
    const prices = {
      monthly: 100000, // ₦1000 = 100000 kobo
      quarterly: 270000, // ₦2700 = 270000 kobo (10% discount)
      yearly: 960000, // ₦9600 = 960000 kobo (20% discount)
    };
    
    return prices[plan];
  }

  // Get subscription amount in Naira for display
  getSubscriptionAmountNaira(plan: 'monthly' | 'quarterly' | 'yearly'): number {
    return this.getSubscriptionAmount(plan) / 100;
  }

  // Save subscription to Firestore
  async saveSubscription(subscriptionData: SubscriptionData): Promise<void> {
    try {
      const userRef = doc(db, 'users', subscriptionData.userId);
      
      await updateDoc(userRef, {
        subscription: {
          plan: subscriptionData.plan,
          amount: subscriptionData.amount,
          startDate: Timestamp.fromDate(subscriptionData.startDate),
          endDate: Timestamp.fromDate(subscriptionData.endDate),
          status: subscriptionData.status,
          paystackReference: subscriptionData.paystackReference,
          updatedAt: Timestamp.now(),
        },
        subscriptionStatus: subscriptionData.status,
        updatedAt: Timestamp.now(),
      });
      
      console.log('Subscription saved successfully');
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  }

  // Verify payment was successful (you should verify on your backend in production)
  async verifyPayment(reference: string): Promise<boolean> {
    // In production, this should call your backend to verify with Paystack
    // For now, we'll assume the payment is successful if we have a reference
    console.log('Verifying payment with reference:', reference);
    return true;
  }

  // Activate subscription after successful payment
  async activateSubscription(
    userId: string,
    plan: 'monthly' | 'quarterly' | 'yearly',
    paystackReference: string
  ): Promise<void> {
    try {
      // Verify payment first
      const isValid = await this.verifyPayment(paystackReference);
      
      if (!isValid) {
        throw new Error('Payment verification failed');
      }

      const startDate = new Date();
      const endDate = this.calculateEndDate(plan, startDate);
      const amount = this.getSubscriptionAmountNaira(plan);

      const subscriptionData: SubscriptionData = {
        userId,
        plan,
        amount,
        startDate,
        endDate,
        status: 'active',
        paystackReference,
      };

      await this.saveSubscription(subscriptionData);
      console.log('Subscription activated successfully');
    } catch (error) {
      console.error('Error activating subscription:', error);
      throw error;
    }
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { getDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const subscription = data.subscription;

        if (!subscription) return false;

        // Check if subscription is active and not expired
        if (subscription.status === 'active') {
          const endDate = subscription.endDate.toDate();
          return endDate > new Date();
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
