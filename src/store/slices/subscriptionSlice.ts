import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionStatus, SubscriptionPlan, Payment } from '@/types';

interface SubscriptionState {
  status: SubscriptionStatus | null;
  plans: SubscriptionPlan[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  status: null,
  plans: [],
  payments: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async () => {
    // This will be implemented with Firebase service
    const plans: SubscriptionPlan[] = [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        duration: 'monthly',
        priceNGN: 2500,
        features: ['All workout plans', 'Diet recommendations', 'Progress tracking'],
      },
      {
        id: 'quarterly',
        name: 'Quarterly Plan',
        duration: 'quarterly',
        priceNGN: 6000,
        features: ['All workout plans', 'Diet recommendations', 'Progress tracking', '20% savings'],
        isPopular: true,
      },
      {
        id: 'yearly',
        name: 'Yearly Plan',
        duration: 'yearly',
        priceNGN: 20000,
        features: ['All workout plans', 'Diet recommendations', 'Progress tracking', '33% savings', 'Premium support'],
      },
    ];
    return plans;
  }
);

export const initializePayment = createAsyncThunk(
  'subscription/initializePayment',
  async ({ planId, email }: { planId: string; email: string }) => {
    // This will be implemented with Paystack service
    const payment: Payment = {
      id: Date.now().toString(),
      userId: '',
      amount: 0,
      currency: 'NGN',
      paystackReference: '',
      status: 'pending',
      planId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return payment;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateSubscriptionStatus: (state, action: PayloadAction<SubscriptionStatus>) => {
      state.status = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscription plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch subscription plans';
      })
      // Initialize payment
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
      });
  },
});

export const { clearError, updateSubscriptionStatus, addPayment } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;