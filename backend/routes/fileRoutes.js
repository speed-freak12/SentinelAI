const express = require("express");
const multer = require("multer");
const Scan = require("../models/Scan");

const router = express.Router();

// Store uploaded files temporarily in memory.
// We are NOT permanently storing the user's file yet.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
});

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

// Scan a REAL uploaded file
router.post("/scan", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const filename = req.file.originalname;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;

    /*
     * Temporary detection logic.
     *
     * This is NOT mock file data.
     * The filename and actual uploaded file metadata come
     * directly from the user's selected file.
     *
     * We will replace this section with real malware
     * analysis in the next step.
     */
    const suspiciousExtensions = [
      ".exe",
      ".bat",
      ".cmd",
      ".scr",
      ".vbs",
      ".ps1",
      ".jar",
    ];

    const lowerFilename = filename.toLowerCase();

    const isSuspicious = suspiciousExtensions.some((extension) =>
      lowerFilename.endsWith(extension)
    );

    const result = isSuspicious ? "Suspicious" : "Clean";

    const threatScore = isSuspicious ? 60 : 5;

    const scan = await Scan.create({
      filename,
      fileType,
      fileSize,
      result,
      threatScore,
    });

    res.status(201).json({
      success: true,
      message: "File scanned successfully",
      scan,
    });
  } catch (err) {
    console.error("File Scan Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;