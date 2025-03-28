import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  clockInOut,
  fetchStatus,
  toggleBreak,
  updateCurrentTime,
  resetError
} from "../../../Redux/features/attendance/attendanceSlice";

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
    breakCount,
  } = useSelector((state) => state.attendance);

  // Fetch initial status
  useEffect(() => {
    dispatch(fetchStatus());

    // Update current time every second
    const timer = setInterval(() => {
      dispatch(updateCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

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
    dispatch(clockInOut());
  };

  const handleBreak = async () => {
    if (!isClockedIn) {
      toast.error("You must clock in first");
      return;
    }
    if (!isOnBreak && breakCount >= 3) {
      toast.error("Maximum 3 breaks allowed per day");
      return;
    }
    dispatch(toggleBreak());
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
              <p className="text-2xl font-mono text-gray-800">{workTime}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Break Time ({breakCount}/3)</p>
              <p className="text-2xl font-mono text-gray-800">{breakTime}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleBreak}
              disabled={!isClockedIn || status === "loading" || (breakCount >= 3 && !isOnBreak)}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                isOnBreak
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${
                !isClockedIn || status === "loading" || (breakCount >= 3 && !isOnBreak)
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
              disabled={status === "loading" || (hasClockedInToday && !isClockedIn)}
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