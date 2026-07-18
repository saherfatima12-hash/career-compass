const userRoutes = require("./routes/userRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("Career Compass Backend Running");
});


const PORT = process.env.PORT || 5000;
const RETRY_DELAY_MS = 5000;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    if (error.code === "ECONNREFUSED" && error.syscall === "querySrv") {
      console.error(
        "MongoDB Atlas DNS lookup was refused. Check your internet/VPN and DNS settings, then retry."
      );
    }

    console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`);
    setTimeout(connectToDatabase, RETRY_DELAY_MS);
  }
}

connectToDatabase();
