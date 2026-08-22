const Threat = require("../models/Threat");

exports.getThreats = async (req, res) => {
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
};

exports.getThreatById = async (req, res) => {
    try {
        const threat = await Threat.findById(
            req.params.id
        ).lean();

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
};