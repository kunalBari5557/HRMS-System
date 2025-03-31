const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as needed

// GET /api/users - Fetch all users
exports.users = async (req, res) => {
    try {
    const users = await User.find({}, "email phoneNumber role createdAt");
    console.log("users",users)
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}