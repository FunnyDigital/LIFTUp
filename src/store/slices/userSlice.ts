import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isProfileComplete: boolean;
}

const initialState: UserState = {
  profile: null,
  isProfileComplete: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isProfileComplete = true;
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