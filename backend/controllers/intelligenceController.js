const Intelligence = require("../models/Intelligence");

exports.getIntelligence = async (
    req,
    res
) => {
    try {
        const [
            cves,
            malware,
            feed,
            cvesTracked,
            malwareFamilies,
            activeIOCs,
            feedSources,
        ] = await Promise.all([
            Intelligence.find({
                kind: "CVE",
                active: true,
            })
                .sort({ createdAt: -1 })
                .limit(12)
                .lean(),

            Intelligence.find({
                kind: "Malware",
                active: true,
            })
                .sort({ detections: -1 })
                .limit(10)
                .lean(),

            Intelligence.find({
                kind: "Feed",
                active: true,
            })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            Intelligence.countDocuments({
                kind: "CVE",
                active: true,
            }),

            Intelligence.countDocuments({
                kind: "Malware",
                active: true,
            }),

            Intelligence.countDocuments({
                kind: "Feed",
                active: true,
            }),

            Intelligence.distinct("source", {
                active: true,
                source: {
                    $nin: ["", null],
                },
            }),
        ]);

        return res.status(200).json({
            success: true,
            intelligence: {
                cves,
                malware,
                feed,
                stats: {
                    cvesTracked,
                    malwareFamilies,
                    activeIOCs,
                    feedSources:
                        feedSources.length,
                },
            },
        });
    } catch (err) {
        console.error(
            "Get Intelligence Error:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};