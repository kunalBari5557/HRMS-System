const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Clock In/Out
exports.clockInOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Check if user is already clocked in
    const existingAttendance = await Attendance.findOne({
      user: userId,
      clockOut: { $exists: false }
    });

    if (existingAttendance) {
      // Clock Out
      existingAttendance.clockOut = new Date();
      existingAttendance.totalHours = calculateHours(existingAttendance.clockIn, existingAttendance.clockOut);
      await existingAttendance.save();
      return res.json({ message: 'Clocked out successfully', attendance: existingAttendance });
    } else {
      // Clock In
      const newAttendance = new Attendance({
        user: userId,
        clockIn: new Date(),
        status: 'working'
      });
      await newAttendance.save();
      return res.json({ message: 'Clocked in successfully', attendance: newAttendance });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Break In/Out
exports.breakInOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentAttendance = await Attendance.findOne({
      user: userId,
      clockOut: { $exists: false }
    });

    if (!currentAttendance) {
      return res.status(400).json({ error: 'You must clock in first' });
    }

    if (currentAttendance.status === 'working') {
      // Break In
      currentAttendance.breaks.push({
        start: new Date(),
        status: 'on break'
      });
      currentAttendance.status = 'on break';
    } else {
      // Break Out
      const currentBreak = currentAttendance.breaks.find(b => !b.end);
      if (currentBreak) {
        currentBreak.end = new Date();
        currentBreak.duration = calculateHours(currentBreak.start, currentBreak.end);
      }
      currentAttendance.status = 'working';
    }

    await currentAttendance.save();
    res.json({ message: `Break ${currentAttendance.status === 'on break' ? 'started' : 'ended'}`, attendance: currentAttendance });
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
      clockOut: { $exists: false }
    });

    const status = currentAttendance 
      ? { 
          isClockedIn: true,
          isOnBreak: currentAttendance.status === 'on break',
          clockInTime: currentAttendance.clockIn,
          currentBreak: currentAttendance.breaks.find(b => !b.end)
        }
      : { isClockedIn: false, isOnBreak: false };

    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function calculateHours(start, end) {
  return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
}