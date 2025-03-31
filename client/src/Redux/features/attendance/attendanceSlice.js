import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

export const fetchStatus = createAsyncThunk(
  "attendance/fetchStatus",
  async () => {
    const response = await api.get("/attendance/status");
    return response.data;
  }
);

export const clockInOut = createAsyncThunk(
  "attendance/clockInOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/attendance/clock");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleBreak = createAsyncThunk(
  "attendance/toggleBreak",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/attendance/break");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    isClockedIn: false,
    isOnBreak: false,
    currentTime: "00:00:00",
    breakTime: "00:00:00",
    workTime: localStorage.getItem("workTime") || "00:00:00", // Initialize from localStorage
    status: "idle",
    error: null,
    hasClockedInToday: false,
    breakCount: 0,
    clockInTime: null,
  },
  reducers: {
    updateCurrentTime: (state) => {
      const now = new Date();
      state.currentTime = now.toLocaleTimeString();

      // Update work time if clocked in and not on break
      if (state.isClockedIn && !state.isOnBreak && state.clockInTime) {
        const clockInTime = new Date(state.clockInTime);
        const diffInMs = now - clockInTime;
        const diffInSec = Math.floor(diffInMs / 1000);

        // Calculate hours, minutes, seconds
        const hours = Math.floor(diffInSec / 3600);
        const minutes = Math.floor((diffInSec % 3600) / 60);
        const seconds = diffInSec % 60;

        // Format as HH:MM:SS
        state.workTime = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":");
      }
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchStatus.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchStatus.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isClockedIn = action.payload.isClockedIn;
      state.isOnBreak = action.payload.isOnBreak;
      state.hasClockedInToday = action.payload.hasClockedInToday || false;
      state.breakCount = action.payload.breakCount || 0;
      state.workTime = action.payload.workTime || localStorage.getItem("workTime") || "00:00:00";
      state.clockInTime = action.payload.clockInTime || null;
    })
    .addCase(fetchStatus.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    })
    .addCase(clockInOut.pending, (state) => {
      state.status = "loading";
    })
    .addCase(clockInOut.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isClockedIn = action.payload.isClockedIn;
      state.isOnBreak = false;
      state.hasClockedInToday = !action.payload.isClockedIn;
      state.error = null;

      if (action.payload.isClockedIn) {
        // When clocking in, set the clockInTime to current time
        state.clockInTime = new Date().toISOString();
        state.workTime = "00:00:00";
        localStorage.removeItem("workTime"); // Clear stored work time when clocking in
      } else {
        // When clocking out, reset clockInTime and save work time to localStorage
        state.clockInTime = null;
        state.breakCount = 0;
        localStorage.setItem("workTime", state.workTime); // Save work time to localStorage
      }
    })
    .addCase(clockInOut.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.error || action.error.message;
      state.hasClockedInToday =
        action.payload?.error === "You have already clocked in today";
    })
    .addCase(toggleBreak.pending, (state) => {
      state.status = "loading";
    })
    .addCase(toggleBreak.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isOnBreak = action.payload.isOnBreak;
      state.breakCount = action.payload.breakCount;
      state.error = null;
    })
    .addCase(toggleBreak.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.error || action.error.message;
    });
  },
});

export const { updateCurrentTime, resetError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
