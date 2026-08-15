const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    fileType: String,
    fileSize: Number,
    result: {
      type: String,
      enum: ["Clean", "Suspicious", "Malicious"],
      default: "Clean",
    },
    threatScore: {
      type: Number,
      default: 0,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scan", scanSchema);