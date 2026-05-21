const mongoose = require("mongoose");

const feedbacksReceived = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  responses: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students", // Reference to the student who provided the feedback
      },
      answers: [String], // Array of answers submitted by the student
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  isProcessed: {
    type: Boolean,
    required: true,
  },
  professorName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Feedbacks Received", feedbacksReceived);
