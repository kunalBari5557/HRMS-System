require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const seedAdmin = require("./seeds/adminSeeder");
const cors = require("cors")

const app = express();
connectDB();
seedAdmin();

app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/user"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/todo", require("./routes/todo"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
