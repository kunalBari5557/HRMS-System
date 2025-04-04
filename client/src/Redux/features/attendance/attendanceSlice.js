import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const secondsToTimeString = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

// Load initial state from localStorage
const loadInitialState = () => {
  const today = new Date().toDateString();
  const lastClockOutDate = localStorage.getItem("lastClockOutDate");

  if (lastClockOutDate !== today) {
    localStorage.clear();
    localStorage.setItem("lastClockOutDate", today);
  }

  return {
    isClockedIn: localStorage.getItem("isClockedIn") === "true" || false,
    isOnBreak: localStorage.getItem("isOnBreak") === "true" || false,
    currentTime: "00:00:00",
    breakTime: localStorage.getItem("breakTime") || "00:00:00",
    workTime: localStorage.getItem("workTime") || "00:00:00",
    status: "idle",
    error: null,
    hasClockedInToday:
      localStorage.getItem("hasClockedInToday") === "true" || false,
    breakCount: parseInt(localStorage.getItem("breakCount")) || 0,
    clockInTime: localStorage.getItem("clockInTime") || null,
    breakStartTime: localStorage.getItem("breakStartTime") || null,
    totalBreakDuration:
      parseInt(localStorage.getItem("totalBreakDuration")) || 0,
    attendanceList: JSON.parse(localStorage.getItem("attendanceList")) || [],
  };
};

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

// ✅ New AsyncThunk: Fetch Attendance List
export const fetchAttendanceList = createAsyncThunk(
  "attendance/fetchAttendanceList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/attendance/list");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch attendance list"
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: loadInitialState(),
  reducers: {
    updateCurrentTime: (state) => {
      const now = new Date();
      state.currentTime = now.toLocaleTimeString();

      if (state.isClockedIn) {
        if (state.isOnBreak && state.breakStartTime) {
          // Calculate break duration live
          const breakStart = new Date(state.breakStartTime);
          const breakDuration = Math.floor((now - breakStart) / 1000);
          state.breakTime = secondsToTimeString(breakDuration);
          localStorage.setItem("breakTime", state.breakTime);
        } else if (state.clockInTime) {
          // Calculate work time correctly
          const clockInTime = new Date(state.clockInTime);
          const workDuration =
            Math.floor((now - clockInTime) / 1000) - state.totalBreakDuration;
          state.workTime = secondsToTimeString(workDuration);
          localStorage.setItem("workTime", state.workTime);
        }
      }
    },
    resetError: (state) => {
      state.error = null;
    },
    resetAttendance: (state) => {
      // Clear localStorage related to attendance
      localStorage.removeItem("isClockedIn");
      localStorage.removeItem("isOnBreak");
      localStorage.removeItem("breakTime");
      localStorage.removeItem("workTime");
      localStorage.removeItem("hasClockedInToday");
      localStorage.removeItem("breakCount");
      localStorage.removeItem("clockInTime");
      localStorage.removeItem("breakStartTime");
      localStorage.removeItem("totalBreakDuration");
      localStorage.removeItem("attendanceList");

      // Reset Redux state
      return {
        ...state,
        isClockedIn: false,
        isOnBreak: false,
        currentTime: "00:00:00",
        breakTime: "00:00:00",
        workTime: "00:00:00",
        status: "idle",
        error: null,
        hasClockedInToday: false,
        breakCount: 0,
        clockInTime: null,
        breakStartTime: null,
        totalBreakDuration: 0,
        attendanceList: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Only update from server if we don't have local data
        if (!state.clockInTime) {
          state.isClockedIn = action.payload.isClockedIn;
          state.isOnBreak = action.payload.isOnBreak;
          state.hasClockedInToday = action.payload.hasClockedInToday || false;
          state.breakCount = action.payload.breakCount || 0;
          state.workTime =
            action.payload.workTime ||
            localStorage.getItem("workTime") ||
            "00:00:00";
          state.breakTime =
            action.payload.breakTime ||
            localStorage.getItem("breakTime") ||
            "00:00:00";
          state.clockInTime = action.payload.clockInTime || null;
          state.breakStartTime = action.payload.breakStartTime || null;
          state.totalBreakDuration =
            action.payload.totalBreakDuration ||
            parseInt(localStorage.getItem("totalBreakDuration")) ||
            0;
        }

        // Always persist the current state
        localStorage.setItem("isClockedIn", state.isClockedIn);
        localStorage.setItem("isOnBreak", state.isOnBreak);
        localStorage.setItem("hasClockedInToday", state.hasClockedInToday);
        localStorage.setItem("breakCount", state.breakCount);
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
          const now = new Date().toISOString();
          state.clockInTime = now;
          state.workTime = "00:00:00";
          state.breakTime = "00:00:00";
          state.breakCount = 0;
          state.totalBreakDuration = 0;
          state.breakStartTime = null;

          localStorage.setItem("clockInTime", now);
          localStorage.setItem("workTime", "00:00:00");
          localStorage.setItem("breakTime", "00:00:00");
          localStorage.removeItem("breakStartTime");
          localStorage.setItem("totalBreakDuration", "0");
          localStorage.setItem("lastBreakTime", "00:00:00");
        } else {
          localStorage.setItem("workTime", state.workTime);
          localStorage.setItem("breakTime", state.breakTime);
          localStorage.setItem("lastClockOutDate", new Date().toDateString());
          localStorage.setItem("lastBreakTime", state.breakTime);
          state.clockInTime = null;
          state.breakStartTime = null;
        }

        localStorage.setItem("isClockedIn", state.isClockedIn);
        localStorage.setItem("isOnBreak", state.isOnBreak);
        localStorage.setItem("hasClockedInToday", state.hasClockedInToday);
        localStorage.setItem("breakCount", state.breakCount);

        // ✅ Dispatch fetchAttendanceList to update attendance state after clock-in/out
        state.attendanceList =
          action.payload.attendanceList || state.attendanceList;
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
        const now = new Date();

        if (action.payload.isOnBreak) {
          state.isOnBreak = true;
          state.breakStartTime = now.toISOString();
          localStorage.setItem("breakStartTime", state.breakStartTime);
        } else {
          if (state.breakStartTime) {
            const breakStart = new Date(state.breakStartTime);
            const breakDuration = Math.floor((now - breakStart) / 1000);
            state.totalBreakDuration += breakDuration;
            localStorage.setItem(
              "totalBreakDuration",
              state.totalBreakDuration
            );
            state.breakTime = secondsToTimeString(state.totalBreakDuration);
            localStorage.setItem("breakTime", state.breakTime);
          }

          state.isOnBreak = false;
          state.breakStartTime = null;
          state.breakCount = action.payload.breakCount;
          localStorage.removeItem("breakStartTime");
        }

        localStorage.setItem("isClockedIn", state.isClockedIn);
        localStorage.setItem("isOnBreak", state.isOnBreak);
        localStorage.setItem("hasClockedInToday", state.hasClockedInToday);
        localStorage.setItem("breakCount", state.breakCount);
        state.error = null;

        // ✅ Dispatch fetchAttendanceList to update attendance state after break in/out
        state.attendanceList =
          action.payload.attendanceList || state.attendanceList;
      })
      .addCase(toggleBreak.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      })
      .addCase(fetchAttendanceList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttendanceList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attendanceList = action.payload;

        // Save in localStorage
        localStorage.setItem("attendanceList", JSON.stringify(action.payload));
      })
      .addCase(fetchAttendanceList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateCurrentTime, resetError, resetAttendance } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
