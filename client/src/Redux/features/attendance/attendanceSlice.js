// features/attendance/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchStatus = createAsyncThunk(
  'attendance/fetchStatus',
  async () => {
    const response = await api.get('/attendance/status');
    return response.data;
  }
);

export const clockInOut = createAsyncThunk(
  'attendance/clockInOut',
  async () => {
    const response = await api.post('/attendance/clock');
    return response.data;
  }
);

export const toggleBreak = createAsyncThunk(
  'attendance/toggleBreak',
  async () => {
    const response = await api.post('/attendance/break');
    return response.data;
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
  },
  reducers: {
    updateCurrentTime: (state) => {
      const now = new Date();
      state.currentTime = now.toLocaleTimeString();
    },
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
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(clockInOut.fulfilled, (state) => {
        state.isClockedIn = !state.isClockedIn;
        state.isOnBreak = false;
      })
      .addCase(toggleBreak.fulfilled, (state) => {
        if (state.isClockedIn) {
          state.isOnBreak = !state.isOnBreak;
        }
      });
  },
});

export const { updateCurrentTime } = attendanceSlice.actions;
export default attendanceSlice.reducer;