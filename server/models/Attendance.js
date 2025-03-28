const mongoose = require('mongoose');

const breakSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: Date,
  duration: Number, // in hours
  status: { type: String, default: 'on break' }
});

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clockIn: { type: Date, required: true },
  clockOut: Date,
  totalHours: Number,
  breaks: [breakSchema],
  status: { type: String, enum: ['working', 'on break'], default: 'working' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);