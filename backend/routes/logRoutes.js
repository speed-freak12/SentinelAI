const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB
    },
});

router.post(
    "/analyze",
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Log file is required",
                });
            }

            const filename = req.file.originalname;
            const fileSize = req.file.size;
            const fileType = req.file.mimetype;

            /*
             * The actual uploaded file is available here:
             *
             * req.file.buffer
             *
             * For now we perform basic REAL log inspection.
             * No fake threat numbers are returned.
             */

            const content =
                req.file.buffer.toString("utf8");

            const lines = content
                .split(/\r?\n/)
                .filter((line) => line.trim());

            const totalLines = lines.length;

            const lowerContent =
                content.toLowerCase();

            const criticalPatterns = [
                "critical",
                "fatal",
                "ransomware",
                "malware",
                "rootkit",
                "credential theft",
            ];

            const suspiciousPatterns = [
                "failed login",
                "authentication failure",
                "unauthorized",
                "brute force",
                "suspicious",
                "intrusion",
                "attack",
                "exploit",
                "denied",
            ];

            const criticalMatches =
                criticalPatterns.reduce(
                    (count, pattern) => {
                        return (
                            count +
                            (lowerContent.match(
                                new RegExp(
                                    pattern.replace(
                                        /[-/\\^$*+?.()|[\]{}]/g,
                                        "\\$&"
                                    ),
                                    "g"
                                )
                            ) || []).length
                        );
                    },
                    0
                );

            const suspiciousMatches =
                suspiciousPatterns.reduce(
                    (count, pattern) => {
                        return (
                            count +
                            (lowerContent.match(
                                new RegExp(
                                    pattern.replace(
                                        /[-/\\^$*+?.()|[\]{}]/g,
                                        "\\$&"
                                    ),
                                    "g"
                                )
                            ) || []).length
                        );
                    },
                    0
                );

            const threats = criticalMatches;
            const anomalies = suspiciousMatches;

            const clean = Math.max(
                totalLines - threats - anomalies,
                0
            );

            const threatLevel =
                criticalMatches > 0
                    ? "Critical"
                    : suspiciousMatches > 0
                        ? "Suspicious"
                        : "Clean";

            return res.status(200).json({
                success: true,

                file: {
                    filename,
                    fileSize,
                    fileType,
                },

                analysis: {
                    totalLines,
                    threats,
                    anomalies,
                    clean,
                    threatLevel,
                },

                message:
                    "Log analysis completed successfully",
            });
        } catch (err) {
            console.error(
                "Log Analysis Error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Log analysis failed",
            });
        }
    }
);

module.exports = router;