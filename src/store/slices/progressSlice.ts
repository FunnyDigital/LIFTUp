import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProgressEntry } from '@/types';

interface ProgressState {
  entries: ProgressEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  entries: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProgressEntries = createAsyncThunk(
  'progress/fetchEntries',
  async (userId: string) => {
    // This will be implemented with Firebase service
    const entries: ProgressEntry[] = [];
    return entries;
  }
);

export const addProgressEntry = createAsyncThunk(
  'progress/addEntry',
  async (entry: Omit<ProgressEntry, 'id'>) => {
    // This will be implemented with Firebase service
    const newEntry: ProgressEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    return newEntry;
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProgressEntry: (state, action: PayloadAction<ProgressEntry>) => {
      const index = state.entries.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    removeProgressEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch progress entries
      .addCase(fetchProgressEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgressEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
      })
      .addCase(fetchProgressEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress entries';
      })
      // Add progress entry
      .addCase(addProgressEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      });
  },
});

export const { clearError, updateProgressEntry, removeProgressEntry } = progressSlice.actions;
export default progressSlice.reducer;