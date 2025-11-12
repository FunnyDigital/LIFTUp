import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isProfileComplete: boolean;
  workoutPlan?: any;
  dietPlan?: any;
}

const initialState: UserState = {
  profile: null,
  isProfileComplete: false,
  workoutPlan: null,
  dietPlan: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      return {
        ...state,
        profile: action.payload,
        isProfileComplete: true,
      };
    },
    setWorkoutPlan: (state, action: PayloadAction<any>) => {
      state.workoutPlan = action.payload;
    },
    setDietPlan: (state, action: PayloadAction<any>) => {
      state.dietPlan = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.profile = null;
      state.isProfileComplete = false;
    },
  },
});

export const { setProfile, updateProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;