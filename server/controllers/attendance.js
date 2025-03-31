const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const { formatHoursToHMS } = require("../utils/timeFormatter");

function calculateHours(start, end) {
  return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
}

// Clock In/Out
exports.clockInOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user has already clocked in today
    const existingAttendance = await Attendance.findOne({
      user: userId,
      clockIn: { $gte: today },
      clockOut: { $exists: false },
    });

    if (existingAttendance) {
      // Clock Out
      existingAttendance.clockOut = new Date();
      existingAttendance.totalHours = calculateHours(
        existingAttendance.clockIn,
        existingAttendance.clockOut
      );
      await existingAttendance.save();
      return res.json({
        message: "Clocked out successfully",
        attendance: existingAttendance,
        isClockedIn: false,
      });
    } else {
      // Check if user already completed attendance today
      const completedAttendance = await Attendance.findOne({
        user: userId,
        clockIn: { $gte: today },
      });

      if (completedAttendance) {
        return res.status(400).json({
          error: "You have already clocked in today",
        });
      }

      // Clock In
      const newAttendance = new Attendance({
        user: userId,
        clockIn: new Date(),
        status: "working",
      });
      await newAttendance.save();
      return res.json({
        message: "Clocked in successfully",
        attendance: newAttendance,
        isClockedIn: true,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Break In/Out
exports.breakInOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find current attendance record
    const currentAttendance = await Attendance.findOne({
      user: userId,
      clockOut: { $exists: false },
    });

    if (!currentAttendance) {
      return res.status(400).json({ error: "You must clock in first" });
    }

    // Check if trying to start a new break
    if (currentAttendance.status === "working") {
      // Count today's breaks
      const todayBreaks = currentAttendance.breaks.filter((breakItem) => {
        return new Date(breakItem.start) >= today;
      });

      if (todayBreaks.length >= 3) {
        return res
          .status(400)
          .json({ error: "Maximum 3 breaks allowed per day" });
      }

      // Break In
      currentAttendance.breaks.push({
        start: new Date(),
        status: "on break",
      });
      currentAttendance.status = "on break";
    } else {
      // Break Out
      const currentBreak = currentAttendance.breaks.find((b) => !b.end);
      if (currentBreak) {
        currentBreak.end = new Date();
        currentBreak.duration = calculateHours(
          currentBreak.start,
          currentBreak.end
        );
      }
      currentAttendance.status = "working";
    }

    await currentAttendance.save();
    res.json({
      message: `Break ${
        currentAttendance.status === "on break" ? "started" : "ended"
      }`,
      attendance: currentAttendance,
      breakCount: currentAttendance.breaks.filter(
        (b) => new Date(b.start) >= today
      ).length,
      isOnBreak: currentAttendance.status === "on break",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current status
exports.getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentAttendance = await Attendance.findOne({
      user: userId,
      clockOut: { $exists: false },
    });

    const status = currentAttendance
      ? {
          isClockedIn: true,
          isOnBreak: currentAttendance.status === "on break",
          clockInTime: currentAttendance.clockIn,
          currentBreak: currentAttendance.breaks.find((b) => !b.end),
        }
      : { isClockedIn: false, isOnBreak: false };

    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attendance records for the current user
exports.getAttendanceList = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const attendanceRecords = await Attendance.find({ user: userId })
      .sort({ clockIn: -1 })
      .lean();

    const response = attendanceRecords.map(record => {
      // Calculate total break time in hours
      const totalBreakHours = record.breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
      
      // Format both total hours and break hours
      const formattedTotalHours = record.totalHours 
        ? formatHoursToHMS(record.totalHours)
        : null;
      
      const formattedBreakHours = totalBreakHours > 0
        ? formatHoursToHMS(totalBreakHours)
        : '00:00:00';

      return {
        id: record._id,
        date: record.clockIn.toISOString().split('T')[0],
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        totalHours: formattedTotalHours,  // Now in HH:MM:SS format
        breakHours: formattedBreakHours, // Break time in HH:MM:SS
        breakCount: record.breaks.length,
        status: record.clockOut ? 'completed' : 'in-progress'
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
