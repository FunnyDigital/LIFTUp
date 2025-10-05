import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutPlan, Workout, ScheduledWorkout } from '@/types';

interface WorkoutState {
  plans: WorkoutPlan[];
  currentPlan: WorkoutPlan | null;
  scheduledWorkouts: ScheduledWorkout[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  plans: [],
  currentPlan: null,
  scheduledWorkouts: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWorkoutPlans = createAsyncThunk(
  'workout/fetchPlans',
  async (goal?: string) => {
    // This will be implemented with Firebase service
    const plans: WorkoutPlan[] = [];
    return plans;
  }
);

export const selectWorkoutPlan = createAsyncThunk(
  'workout/selectPlan',
  async (planId: string) => {
    // This will be implemented with Firebase service
    const plan: WorkoutPlan | null = null;
    return plan;
  }
);

export const scheduleWorkout = createAsyncThunk(
  'workout/schedule',
  async (scheduledWorkout: Omit<ScheduledWorkout, 'id'>) => {
    // This will be implemented with Firebase service
    const newScheduledWorkout: ScheduledWorkout = {
      ...scheduledWorkout,
      id: Date.now().toString(),
    };
    return newScheduledWorkout;
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateScheduledWorkout: (state, action: PayloadAction<ScheduledWorkout>) => {
      const index = state.scheduledWorkouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.scheduledWorkouts[index] = action.payload;
      }
    },
    removeScheduledWorkout: (state, action: PayloadAction<string>) => {
      state.scheduledWorkouts = state.scheduledWorkouts.filter(w => w.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workout plans
      .addCase(fetchWorkoutPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch workout plans';
      })
      // Select workout plan
      .addCase(selectWorkoutPlan.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      // Schedule workout
      .addCase(scheduleWorkout.fulfilled, (state, action) => {
        state.scheduledWorkouts.push(action.payload);
      });
  },
});

export const { clearError, updateScheduledWorkout, removeScheduledWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;