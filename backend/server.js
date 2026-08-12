require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/gemini", geminiRoutes);

app.get("/", (req, res) => {
  res.send("Career Compass Backend Running");
});

app.get("/healthz", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy"
  });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  console.log("MongoDB connected successfully");
}

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};