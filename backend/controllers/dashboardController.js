const User = require("../models/User");
const Threat = require("../models/Threat");
const Scan = require("../models/Scan");
const Report = require("../models/Report");

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const last24Hours = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    );

    const [
      totalUsers,
      totalThreats,
      totalScans,
      totalReports,
      criticalThreats,
      resolvedThreats,
      recentThreats,
      threatDistribution,
      threatsOverTime,
    ] = await Promise.all([
      User.countDocuments(),

      Threat.countDocuments(),

      Scan.countDocuments(),

      Report.countDocuments(),

      Threat.countDocuments({
        severity: "Critical",
      }),

      Threat.countDocuments({
        status: "Resolved",
      }),

      Threat.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Threat.aggregate([
        {
          $group: {
            _id: "$severity",
            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]),

      Threat.aggregate([
        {
          $match: {
            createdAt: {
              $gte: last24Hours,
              $lte: now,
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: "%H:00",
                date: "$createdAt",
              },
            },

            threats: {
              $sum: 1,
            },

            blocked: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },

            critical: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$severity", "Critical"],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalThreats,
        totalScans,
        totalReports,
        criticalThreats,
        resolvedThreats,
      },

      recentThreats,

      threatDistribution,

      threatsOverTime,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};