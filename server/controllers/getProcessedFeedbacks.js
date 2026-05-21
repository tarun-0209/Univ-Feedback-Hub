const ProcessedFeedback = require("../models/processedFeedbacks");

const getProcessedFeedbacks = async (req, res) => {
  try {
    const { professorName, feedbackFormName } = req.params;

    // Get latest document for strengths/weaknesses
    const latestFeedback = await ProcessedFeedback.findOne({
      professorName,
      feedbackForm: feedbackFormName,
    }).sort({ processedAt: -1 }); // -1 for descending (newest first)

    // Get all metrics data for charts
    const allFeedbacks = await ProcessedFeedback.find({
      professorName,
      feedbackForm: feedbackFormName,
    }).sort({ processedAt: 1 });

    if (!latestFeedback) {
      return res.status(404).json({ message: "No Processed feedback found" });
    }

    // Send the processed feedback data
    res.status(200).json({
      latest: {
        strengths: latestFeedback.strengths,
        weaknesses: latestFeedback.weaknesses,
        processedAt: latestFeedback.processedAt,
      },
      metrics: allFeedbacks.map((fb) => ({
        clarity: fb.metrics.clarity.average,
        doubtResolution: fb.metrics.doubtResolution.average,
        practicalKnowledge: fb.metrics.practicalKnowledge.average,
        overallRating: fb.metrics.overallRating.average,
        date: fb.processedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching processed feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProcessedFeedbacks };
