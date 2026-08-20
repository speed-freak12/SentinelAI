const express = require("express");
const router = express.Router();

const Threat = require("../models/Threat");

// Get all threats
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

// Get a single threat by ID
router.get("/:id", async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id).lean();

    if (!threat) {
      return res.status(404).json({
        success: false,
        message: "Threat not found",
      });
    }

    res.json({
      success: true,
      threat,
    });
  } catch (err) {
    console.error("Get Threat Error:", err);

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

// Update a threat
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      type,
      severity,
      status,
      description,
    } = req.body;

    const threat = await Threat.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(severity !== undefined && { severity }),
        ...(status !== undefined && { status }),
        ...(description !== undefined && { description }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!threat) {
      return res.status(404).json({
        success: false,
        message: "Threat not found",
      });
    }

    res.json({
      success: true,
      message: "Threat updated successfully",
      threat,
    });
  } catch (err) {
    console.error("Update Threat Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Delete a threat
router.delete("/:id", async (req, res) => {
  try {
    const threat = await Threat.findByIdAndDelete(req.params.id).lean();

    if (!threat) {
      return res.status(404).json({
        success: false,
        message: "Threat not found",
      });
    }

    res.json({
      success: true,
      message: "Threat deleted successfully",
      threat,
    });
  } catch (err) {
    console.error("Delete Threat Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;