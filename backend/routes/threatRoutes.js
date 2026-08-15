const express = require("express");
const router = express.Router();

const Threat = require("../models/Threat");

// Test route
router.get("/", async (req, res) => {
  try {
    const threats = await Threat.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      threats,
    });
  } catch (err) {
    console.error("Get Threats Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Create a real threat
router.post("/", async (req, res) => {
  try {
    const {
      title,
      type,
      severity,
      status,
      description,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    const threat = await Threat.create({
      title,
      type,
      severity: severity || "Low",
      status: status || "Detected",
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Threat created successfully",
      threat,
    });
  } catch (err) {
    console.error("Create Threat Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;