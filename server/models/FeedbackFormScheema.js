const mongoose = require("mongoose");
const feedbackFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      options: [String],
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  professorUsername: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FeedbackForm", feedbackFormSchema);
