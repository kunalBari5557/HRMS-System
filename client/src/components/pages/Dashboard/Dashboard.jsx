function Dashboard() {
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
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Timing</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-500 mb-1">Current Time</p>
            <p className="text-2xl font-mono text-gray-800">06:20:02</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-500 mb-1">Break Time</p>
            <p className="text-2xl font-mono text-gray-800">00:20:02</p>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Break
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
              Clock Out
            </button>
          </div>
        </div>

        {/* Live Tracking section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Live Tracking Timing</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-2xl font-mono text-gray-800">00:00:00</p>
          </div>
          
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
            Start Tracking
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
