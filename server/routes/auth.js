const express = require("express");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    check("email").isEmail(),
    check("phoneNumber").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("confirmPassword").not().isEmpty(),
  ],
  register
);

router.post("/login", login);

module.exports = router;
