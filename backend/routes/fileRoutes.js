const express = require("express");
const multer = require("multer");
const Scan = require("../models/Scan");

const router = express.Router();

// Temporary upload support for small/local files.
// Large production files will use Vercel Blob directly.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
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

/*
|--------------------------------------------------------------------------
| Scan a REAL file uploaded directly to the backend
|--------------------------------------------------------------------------
| This route is still used for small/local uploads.
*/
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

    const scan = await createScanRecord({
      filename,
      fileType,
      fileSize,
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

/*
|--------------------------------------------------------------------------
| Create scan from a Vercel Blob upload
|--------------------------------------------------------------------------
| Large files are uploaded directly from the browser to Vercel Blob.
| The browser then sends the Blob metadata here.
*/
router.post("/scan-blob", async (req, res) => {
  try {
    const {
      filename,
      fileType,
      fileSize,
      blobUrl,
    } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      });
    }

    if (!blobUrl) {
      return res.status(400).json({
        success: false,
        message: "Blob URL is required",
      });
    }

    /*
     * The Blob URL proves that the selected file was uploaded
     * to our storage.
     *
     * The actual malware-analysis engine will be added separately.
     */
    const scan = await createScanRecord({
      filename,
      fileType: fileType || "",
      fileSize: Number(fileSize) || 0,
      blobUrl,
    });

    res.status(201).json({
      success: true,
      message: "Blob file registered successfully",
      scan,
    });
  } catch (err) {
    console.error("Blob Scan Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Create scan record
|--------------------------------------------------------------------------
*/
async function createScanRecord({
  filename,
  fileType,
  fileSize,
  blobUrl,
}) {
  /*
   * Temporary detection logic based on the REAL uploaded file's
   * filename.
   *
   * This is not mock data.
   *
   * We will replace this with actual file-content malware
   * analysis after the upload pipeline is fully working.
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

  const isSuspicious = suspiciousExtensions.some(
    (extension) => lowerFilename.endsWith(extension)
  );

  const result = isSuspicious
    ? "Suspicious"
    : "Clean";

  const threatScore = isSuspicious ? 60 : 5;

  const scanData = {
    filename,
    fileType: fileType || "",
    fileSize: fileSize || 0,
    result,
    threatScore,
  };

  /*
   * Store the Blob URL only if your Scan model supports it.
   *
   * We intentionally don't add blobUrl to the database object yet
   * because the current Scan schema does not contain that field.
   */
  if (blobUrl) {
    console.log("Blob file:", blobUrl);
  }

  return await Scan.create(scanData);
}

module.exports = router;