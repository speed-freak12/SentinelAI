const mongoose = require("mongoose");

const threatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Detected", "Investigating", "Resolved"],
      default: "Detected",
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Threat", threatSchema);