const express = require("express");
const router = express.Router();

const Scan = require("../models/Scan");

// Get all scans
router.get("/", async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      scans,
    });
  } catch (err) {
    console.error("Get Scans Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get a single scan by ID
router.get("/:id", async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id).lean();

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
      });
    }

    res.json({
      success: true,
      scan,
    });
  } catch (err) {
    console.error("Get Scan Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Create a scan record
router.post("/scan", async (req, res) => {
  try {
    const {
      filename,
      fileType,
      fileSize,
      result,
      threatScore,
      scannedBy,
    } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    const scan = await Scan.create({
      filename,
      fileType: fileType || "",
      fileSize: fileSize || 0,
      result: result || "Clean",
      threatScore:
        typeof threatScore === "number" ? threatScore : 0,
      scannedBy: scannedBy || undefined,
    });

    res.status(201).json({
      success: true,
      message: "Scan created successfully",
      scan,
    });
  } catch (err) {
    console.error("Create Scan Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;