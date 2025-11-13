import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { userDataService } from '@/services/userDataService';
import { setProfile, setWorkoutPlan, setDietPlan } from './userSlice';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
};

// Async thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { dispatch }) => {
    const response = await authService.signInWithEmail(email, password);
    // Sync all user data from Firebase to Redux
    if (response && response.id) {
      const userData = await userDataService.loadUserData(response.id);
      if (userData) {
        if (userData.profile && userData.profile.fitnessGoal) {
          dispatch(setProfile(userData.profile));
        }
        if (userData.workoutPlan) {
          dispatch(setWorkoutPlan(userData.workoutPlan));
        }
        if (userData.dietPlan) {
          dispatch(setDietPlan(userData.dietPlan));
        }
      }
    }
    return response;
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.signUpWithEmail(email, password);
    return response;
  }
);

export const signInWithPhone = createAsyncThunk(
  'auth/signInWithPhone',
  async ({ phoneNumber, otp }: { phoneNumber: string; otp: string }, { dispatch }) => {
    const response = await authService.signInWithPhone(phoneNumber, otp);
    // Sync all user data from Firebase to Redux
    if (response && response.id) {
      const userData = await userDataService.loadUserData(response.id);
      if (userData) {
        if (userData.profile && userData.profile.fitnessGoal) {
          dispatch(setProfile(userData.profile));
        }
        if (userData.workoutPlan) {
          dispatch(setWorkoutPlan(userData.workoutPlan));
        }
        if (userData.dietPlan) {
          dispatch(setDietPlan(userData.dietPlan));
        }
      }
    }
    return response;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    await authService.signOut();
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch }) => {
    const user = await authService.getCurrentUser();
    // Sync all user data from Firebase to Redux
    if (user && user.id) {
      const userData = await userDataService.loadUserData(user.id);
      if (userData) {
        if (userData.profile && userData.profile.fitnessGoal) {
          dispatch(setProfile(userData.profile));
        }
        if (userData.workoutPlan) {
          dispatch(setWorkoutPlan(userData.workoutPlan));
        }
        if (userData.dietPlan) {
          dispatch(setDietPlan(userData.dietPlan));
        }
      }
    }
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingComplete: (state) => {
      state.hasCompletedOnboarding = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with email
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.hasCompletedOnboarding = !!action.payload?.profile?.fitnessGoal;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sign in failed';
      })
      // Sign up with email
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.hasCompletedOnboarding = false;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sign up failed';
      })
      // Sign in with phone
      .addCase(signInWithPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.hasCompletedOnboarding = !!action.payload?.profile?.fitnessGoal;
      })
      .addCase(signInWithPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Phone sign in failed';
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.hasCompletedOnboarding = false;
        state.error = null;
      })
      // Check auth state
      .addCase(checkAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.hasCompletedOnboarding = !!action.payload?.profile?.fitnessGoal;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.hasCompletedOnboarding = false;
        }
      });
  },
});

export const { clearError, setOnboardingComplete, updateUser } = authSlice.actions;
export default authSlice.reducer;