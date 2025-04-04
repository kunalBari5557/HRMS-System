const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');

// Protect all attendance routes
router.use(auth);

router.post('/clock', attendanceController.clockInOut);
router.post('/break', attendanceController.breakInOut);
router.get('/status', attendanceController.getStatus);
router.get('/list', attendanceController.getAttendanceList);

module.exports = router;