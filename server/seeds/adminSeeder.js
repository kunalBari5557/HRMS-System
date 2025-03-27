const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "Admin" });
  if (existingAdmin) return;

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    email: "admin@example.com",
    phoneNumber: "123456789",
    password: hashedPassword,
    role: "Admin",
  });
};

module.exports = seedAdmin;
