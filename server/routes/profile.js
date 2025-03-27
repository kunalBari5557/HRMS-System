const express = require("express");
const { getProfile } = require("../controllers/profileController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getProfile);

module.exports = router;
