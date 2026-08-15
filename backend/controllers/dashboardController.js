const User = require("../models/User");
const Threat = require("../models/Threat");
const Scan = require("../models/Scan");
const Report = require("../models/Report");

exports.getDashboardStats = async (req, res) => {
  try {
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
      // Total users
      User.countDocuments(),

      // Total threats
      Threat.countDocuments(),

      // Total scans
      Scan.countDocuments(),

      // Total reports
      Report.countDocuments(),

      // Critical threats
      Threat.countDocuments({ severity: "Critical" }),

      // Resolved threats
      Threat.countDocuments({ status: "Resolved" }),

      // Latest 5 real threats
      Threat.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Threats grouped by severity
      Threat.aggregate([
        {
          $group: {
            _id: "$severity",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Threat activity grouped by hour
      Threat.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%H:00",
                date: "$createdAt",
              },
            },

            // Total threats
            threats: {
              $sum: 1,
            },

            // Resolved threats = blocked
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

            // Critical threats
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

    res.json({
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

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};