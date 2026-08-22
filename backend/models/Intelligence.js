const mongoose = require("mongoose");

const intelligenceSchema = new mongoose.Schema(
    {
        kind: {
            type: String,
            enum: ["CVE", "Malware", "Feed"],
            required: true,
        },

        identifier: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        severity: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical",
            ],
            default: "Low",
        },

        category: {
            type: String,
            default: "",
        },

        source: {
            type: String,
            default: "",
        },

        exploitAvailable: {
            type: Boolean,
            default: false,
        },

        detections: {
            type: Number,
            default: 0,
        },

        trend: {
            type: Number,
            default: 0,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Intelligence",
        intelligenceSchema
    );