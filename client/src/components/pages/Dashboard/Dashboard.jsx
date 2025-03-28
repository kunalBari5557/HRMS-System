import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clockInOut,
  fetchStatus,
  toggleBreak,
  updateCurrentTime,
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

  const handleClockInOut = () => {
    dispatch(clockInOut());
  };

  const handleBreak = () => {
    if (!isClockedIn) return;
    dispatch(toggleBreak());
  };

  return (
    <div className="flex items-center justify-center p-4">
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

          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-500 mb-1">
              {isOnBreak ? "Break Time" : "Work Time"}
            </p>
            <p className="text-2xl font-mono text-gray-800">
              {isOnBreak ? breakTime : workTime}
            </p>
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
              disabled={status === "loading"}
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
                : "Clock In"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
