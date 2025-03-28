import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

export const fetchStatus = createAsyncThunk(
  'attendance/fetchStatus',
  async () => {
    const response = await api.get('/attendance/status');
    return response.data;
  }
);

export const clockInOut = createAsyncThunk(
  'attendance/clockInOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/clock');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleBreak = createAsyncThunk(
  'attendance/toggleBreak',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/break');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    isClockedIn: false,
    isOnBreak: false,
    currentTime: '00:00:00',
    breakTime: '00:00:00',
    workTime: '00:00:00',
    status: 'idle',
    error: null,
    hasClockedInToday: false,
    breakCount: 0,
  },
  reducers: {
    updateCurrentTime: (state) => {
      const now = new Date();
      state.currentTime = now.toLocaleTimeString();
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isClockedIn = action.payload.isClockedIn;
        state.isOnBreak = action.payload.isOnBreak;
        state.hasClockedInToday = action.payload.hasClockedInToday || false;
        state.breakCount = action.payload.breakCount || 0;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(clockInOut.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clockInOut.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isClockedIn = action.payload.isClockedIn;
        state.isOnBreak = false;
        state.hasClockedInToday = !action.payload.isClockedIn;
        state.error = null;
        if (!action.payload.isClockedIn) {
          state.breakCount = 0; // Reset break count when clocking out
        }
      })
      .addCase(clockInOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || action.error.message;
        state.hasClockedInToday = action.payload?.error === 'You have already clocked in today';
      })
      .addCase(toggleBreak.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleBreak.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isOnBreak = action.payload.isOnBreak;
        state.breakCount = action.payload.breakCount;
        state.error = null;
      })
      .addCase(toggleBreak.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export const { updateCurrentTime, resetError } = attendanceSlice.actions;
export default attendanceSlice.reducer;