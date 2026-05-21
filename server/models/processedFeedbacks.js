const mongoose = require("mongoose");

const processedFeedbackSchema = new mongoose.Schema({
  feedbackForm: { type: String, required: true }, // Name of the feedback form
  professorName: { type: String, required: true }, // Professor's name
  professorDepartment: { type: String, required: true }, // Professor's department
  strengths: { type: [String], required: true }, // Array of strengths
  weaknesses: { type: [String], required: true }, // Array of weaknesses
  metrics: {
    clarity: { average: Number, responses: Number },
    doubtResolution: { average: Number, responses: Number },
    practicalKnowledge: { average: Number, responses: Number },
    overallRating: { average: Number, responses: Number },
  },
  processedAt: { type: Date, default: Date.now, required: true }, // Timestamp for when the feedback was processed
});

module.exports = mongoose.model("ProcessedFeedback", processedFeedbackSchema);
