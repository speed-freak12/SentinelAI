const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const threatRoutes = require("./routes/threatRoutes");
const fileRoutes = require("./routes/fileRoutes");
const reportRoutes = require("./routes/reportRoutes");

// MongoDB connection
let isConnecting = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting) {
    await isConnecting;
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  isConnecting = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await isConnecting;
    console.log("✅ MongoDB Connected");
  } finally {
    isConnecting = null;
  }
}

// Make sure MongoDB is connected before API routes run
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/threats", threatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reports", reportRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SentinelAI Backend Running 🚀",
  });
});

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;