import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  clockInOut,
  fetchStatus,
  toggleBreak,
  updateCurrentTime,
  resetError,
  fetchAttendanceList,
} from "../../../Redux/features/attendance/attendanceSlice";
import { calculateWorkTime } from "../../../utils/timeUtils";

function Dashboard() {
  const dispatch = useDispatch();
  const {
    isClockedIn,
    isOnBreak,
    currentTime,
    breakTime,
    workTime,
    status,
    error,
    hasClockedInToday,
    attendanceList,
  } = useSelector((state) => state.attendance);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const todayRecord = attendanceList.find((item) => item.date === today);

  // Fetch initial status and set up timer
  useEffect(() => {
    dispatch(fetchStatus());

    // Update current time every second
    const timer = setInterval(() => {
      dispatch(updateCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAttendanceList());
  }, [dispatch, isClockedIn, isOnBreak]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handleClockInOut = async () => {
    if (hasClockedInToday && !isClockedIn) {
      toast.error("You have already clocked in today");
      return;
    }
    const resultAction = await dispatch(clockInOut());
    if (clockInOut.fulfilled.match(resultAction)) {
      if (!resultAction.payload.isClockedIn) {
        toast.success("Clocked out successfully");
      } else {
        toast.success("Clocked in successfully");
      }
    }
  };

  const handleBreak = async () => {
    if (!isClockedIn) {
      toast.error("You must clock in first");
      return;
    }
    const resultAction = await dispatch(toggleBreak());
    if (toggleBreak.fulfilled.match(resultAction)) {
      if (resultAction.payload.isOnBreak) {
        toast.success("Break started");
      } else {
        toast.success("Break ended");
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Oliver Smith</h1>
          <p className="text-gray-600">UI/UX Designer</p>
        </div>

        {/* Your Timing section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Your Timing
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-500 mb-1">Current Time</p>
            <p className="text-2xl font-mono text-gray-800">{currentTime}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Work Time</p>
              <p className="text-2xl font-mono text-gray-800">
                {isClockedIn
                  ? workTime ?? "00:00:00"
                  : todayRecord
                  ? calculateWorkTime(
                      todayRecord.totalHours,
                      todayRecord.breakHours
                    )
                  : "00:00:00"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Break Time</p>
              <p className="text-2xl font-mono text-gray-800">
                {isOnBreak
                  ? breakTime ?? "00:00:00"
                  : todayRecord?.breakHours ?? "00:00:00"}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleBreak}
              disabled={!isClockedIn || status === "loading"}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                isOnBreak
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${
                !isClockedIn || status === "loading"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {status === "loading"
                ? "Processing..."
                : isOnBreak
                ? "Break Out"
                : "Break In"}
            </button>
            <button
              onClick={handleClockInOut}
              disabled={
                status === "loading" || (hasClockedInToday && !isClockedIn)
              }
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                isClockedIn
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } ${status === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {status === "loading"
                ? "Processing..."
                : isClockedIn
                ? "Clock Out"
                : hasClockedInToday
                ? "Already Clocked In Today"
                : "Clock In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
