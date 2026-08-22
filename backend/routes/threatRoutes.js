const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Threat = require("../models/Threat");

// Get all threats
router.get("/", async (req, res) => {
  try {
    const threats = await Threat.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      threats,
    });
  } catch (err) {
    console.error("Get Threats Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get a single threat by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid threat ID",
      });
    }

    const threat = await Threat.findById(id).lean();

    if (!threat) {
      return res.status(404).json({
        success: false,
        message: "Threat not found",
      });
    }

    return res.status(200).json({
      success: true,
      threat,
    });
  } catch (err) {
    console.error("Get Threat Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Create a threat
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
      title: String(title).trim(),
      type: String(type).trim(),
      severity: severity || "Low",
      status: status || "Detected",
      description: description
        ? String(description).trim()
        : "",
    });

    return res.status(201).json({
      success: true,
      message: "Threat created successfully",
      threat,
    });
  } catch (err) {
    console.error("Create Threat Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Update a threat
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid threat ID",
      });
    }

    const {
      title,
      type,
      severity,
      status,
      description,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = String(title).trim();
    }

    if (type !== undefined) {
      updateData.type = String(type).trim();
    }

    if (severity !== undefined) {
      updateData.severity = severity;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (description !== undefined) {
      updateData.description = String(
        description
      ).trim();
    }

    const threat =
      await Threat.findByIdAndUpdate(
        id,
        updateData,
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

    return res.status(200).json({
      success: true,
      message: "Threat updated successfully",
      threat,
    });
  } catch (err) {
    console.error("Update Threat Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Delete a threat
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid threat ID",
      });
    }

    const threat =
      await Threat.findByIdAndDelete(id).lean();

    if (!threat) {
      return res.status(404).json({
        success: false,
        message: "Threat not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Threat deleted successfully",
      threat,
    });
  } catch (err) {
    console.error("Delete Threat Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;