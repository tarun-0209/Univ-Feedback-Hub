const FeedbackForm = require("../models/FeedbackFormScheema");
const Professors = require("../models/professorsScheema");
const FeedbacksReceived = require("../models/FeedbacksReceived");

const saveFeedbackForm = async (req, res) => {
  try {
    const formData = req.body.questions;

    // Create an array to store the questions
    const questions = [];

    // Loop through each question object and extract its fields
    formData.forEach((question) => {
      const { description, type, options } = question;
      questions.push({
        description,
        type,
        options,
      });
    });

    // Find the professor using the professorUsername
    const professor = await Professors.findOne({
      username: req.body.professorUsername,
    });

    if (!professor) {
      return res.status(404).json({
        message: "Professor not found",
      });
    }

    // Extract the required fields from the professor
    const { name, Department } = professor;

    // Create a new instance of the FeedbackForm model
    const feedbackForm = new FeedbackForm({
      name: req.body.name,
      questions: questions,
      deadline: req.body.deadline,
      startTime: req.body.startTime,
      professorUsername: req.body.professorUsername,
    });

    // Save the feedback form to the Feedback Received database with no responses
    const savedFeedbackForm = await feedbackForm.save();

    // Create a new instance of the FeedbacksReceived model
    const feedback = new FeedbacksReceived({
      name: savedFeedbackForm.name, // Use the feedback form's name
      professorName: name, // Add professor's name
      department: Department, // Add professor's department
      deadline: req.body.deadline,
      isProcessed: false,
    });

    // Save the feedback to the database
    const savedFeedback = await feedback.save();

    res.status(201).json({
      message: "Feedback form and feedback data saved successfully",
      feedbackForm: savedFeedbackForm,
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Error saving feedback form and feedback data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { saveFeedbackForm };
