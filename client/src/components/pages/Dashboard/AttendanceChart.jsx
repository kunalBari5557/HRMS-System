import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceList } from "../../../Redux/features/attendance/attendanceSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = () => {
  const dispatch = useDispatch();
  const { attendanceList } = useSelector((state) => state.attendance);
  const [activeBar, setActiveBar] = useState(null); // Track hovered bar

  // Get current month & year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  }); // Example: "March 2025"

  useEffect(() => {
    dispatch(fetchAttendanceList());
  }, [dispatch]);

  // Convert HH:MM:SS to total minutes
  const getMinutes = (time) => {
    if (!time) return 0;
    const [hh, mm, ss] = time.split(":").map(Number);
    return hh * 60 + mm + ss / 60; // Convert everything to minutes
  };

  // Transform API response into chart data format
  const chartData = attendanceList.map((entry) => {
    const totalMinutes = getMinutes(entry.totalHours);
    const breakMinutes = getMinutes(entry.breakHours);
    const presentMinutes = totalMinutes - breakMinutes;
    const absentMinutes = totalMinutes === 0 ? 10 : 0; // If no work, show "Absent"

    return {
      date: entry.date.split("-").slice(1).join("/"), // Format: MM/DD
      Present: presentMinutes.toFixed(2),
      Break: breakMinutes,
      Absent: absentMinutes,
    };
  });

  return (
    <div className="p-5 bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-2xl">
      {/* 🟢 Updated Header with Dynamic Month-Year */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🕒 My Time Logs - {monthYear}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          barCategoryGap={20}
          barSize={30}
          onMouseLeave={() => setActiveBar(null)} // Reset highlight on leave
        >
          <XAxis
            dataKey="date"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            axisLine={{ stroke: "#D1D5DB" }}
          />
          <YAxis
            tick={{ fill: "#4B5563", fontSize: 12 }}
            axisLine={{ stroke: "#D1D5DB" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "none",
              padding: "10px",
              fontSize: "14px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingBottom: "10px" }}
            onMouseEnter={(e) => setActiveBar(e.dataKey)}
            onMouseLeave={() => setActiveBar(null)}
          />
          <Bar
            dataKey="Present"
            stackId="a"
            fill="#10B981"
            radius={[6, 6, 0, 0]}
            name="Present"
            opacity={activeBar && activeBar !== "Present" ? 0.4 : 1} // Dim others
          />
          <Bar
            dataKey="Break"
            stackId="a"
            fill="#FACC15"
            radius={[6, 6, 0, 0]}
            name="Break"
            opacity={activeBar && activeBar !== "Break" ? 0.4 : 1}
          />
          <Bar
            dataKey="Absent"
            stackId="a"
            fill="#EF4444"
            radius={[6, 6, 0, 0]}
            name="Absent"
            opacity={activeBar && activeBar !== "Absent" ? 0.4 : 1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
