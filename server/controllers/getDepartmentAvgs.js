const ProcessedFeedback = require("../models/processedFeedbacks");

const getDepartmentAverages = async (req, res) => {
  try {
    const department = req.params.department;

    const result = await ProcessedFeedback.aggregate([
      {
        $match: {
          professorDepartment: department,
          "metrics.clarity.average": { $exists: true },
        },
      },
      // Sort to get latest documents first
      { $sort: { feedbackForm: 1, processedAt: -1 } },
      // Group by professor to get their latest document
      {
        $group: {
          _id: "$feedbackForm",
          clarity: { $first: "$metrics.clarity.average" },
          doubtResolution: { $first: "$metrics.doubtResolution.average" },
          practicalKnowledge: { $first: "$metrics.practicalKnowledge.average" },
          overallRating: { $first: "$metrics.overallRating.average" },
        },
      },
      {
        $group: {
          _id: null,
          clarity: { $avg: "$clarity" },
          doubtResolution: { $avg: "$doubtResolution" },
          practicalKnowledge: { $avg: "$practicalKnowledge" },
          overallRating: { $avg: "$overallRating" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(result[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepartmentAverages };
