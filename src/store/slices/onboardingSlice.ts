import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, FitnessGoal } from '@/types';

interface OnboardingData {
  // Personal Info
  firstName: string;
  lastName: string;
  age: number;
  sex: 'male' | 'female';
  
  // Body Metrics
  height: number; // cm
  weight: number; // kg
  
  // Fitness Goals
  fitnessGoal: FitnessGoal;
  
  // Activity Level
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // Workout Preferences
  workoutDaysPerWeek: number;
  equipmentLevel: 'home' | 'basic_gym' | 'full_gym';
  location: string;
}

interface OnboardingState {
  data: Partial<OnboardingData>;
  currentStep: number;
}

const initialState: OnboardingState = {
  data: {},
  currentStep: 0,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      state.data = { ...state.data, ...action.payload };
    },
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    clearOnboardingData: (state) => {
      state.data = {};
      state.currentStep = 0;
    },
  },
});

export const { updateOnboardingData, setOnboardingStep, clearOnboardingData } = onboardingSlice.actions;
export default onboardingSlice.reducer;
