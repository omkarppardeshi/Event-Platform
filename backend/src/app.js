const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const registerRoutes = require("./routes/register");
const checkinRoutes = require("./routes/checkin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/register", registerRoutes);
app.use("/checkin", checkinRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Platform API running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;