import { lazy, Suspense } from "react";
const MyLogs = lazy(() => import("./MyLogs"));
const AttendanceChart = lazy(() => import("./AttendanceChart"));


function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Attendance Chart (Wider) */}
        <div className="md:w-2/3 w-full">
          <AttendanceChart />
        </div>

        {/* MyLogs (Narrower) */}
        <div className="md:w-1/3 w-full">
          <MyLogs />
        </div>
      </div>
    </Suspense>
  );
}

export default Dashboard;
