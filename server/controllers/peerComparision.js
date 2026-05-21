const ProcessedFeedback = require("../models/processedFeedbacks");

const peerComparision = async (req, res) => {
  try {
    const department = req.params.department;
    if (!department) {
      return res
        .status(400)
        .json({ message: "Department parameter is required" });
    }

    const result = await ProcessedFeedback.aggregate([
      {
        $match: {
          professorDepartment: department,
          "metrics.clarity.average": { $exists: true },
          "metrics.doubtResolution.average": { $exists: true },
          "metrics.practicalKnowledge.average": { $exists: true },
          "metrics.overallRating.average": { $exists: true },
        },
      },
      {
        $sort: { feedbackForm: 1, processedAt: -1 },
      },
      {
        $group: {
          _id: "$feedbackForm",
          latest: { $first: "$$ROOT" },
          totalProfessors: { $addToSet: "$professorName" },
        },
      },
      {
        $addFields: {
          "latest.totalScore": {
            $sum: [
              "$latest.metrics.clarity.average",
              "$latest.metrics.doubtResolution.average",
              "$latest.metrics.practicalKnowledge.average",
              "$latest.metrics.overallRating.average",
            ],
          },
        },
      },
      {
        $sort: { "latest.totalScore": -1 },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          feedbackForm: "$_id",
          totalScore: "$latest.totalScore",
          professor: "$latest.professorName",
          department: "$latest.professorDepartment",
          courseName: "$latest.feedbackForm",
          metrics: "$latest.metrics",
          totalProfessors: { $size: "$totalProfessors" },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { peerComparision };
