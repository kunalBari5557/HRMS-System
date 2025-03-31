const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');

// Protect all attendance routes
router.use(auth);

router.get('/list', usersController.users);

module.exports = router;