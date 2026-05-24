const mongoose = require("mongoose");
const FeedbacksReceived = require("./models/FeedbacksReceived");
const ProcessedFeedback = require("./models/processedFeedbacks");
require("dotenv").config();

const runSimulation = async () => {
  try {
    await mongoose.connect(process.env.DB_LINK);
    console.log("Connected to DB...");

    // 1. Clear all corrupted ProcessedFeedbacks
    await ProcessedFeedback.deleteMany({});
    console.log("Cleared old ProcessedFeedbacks.");

    // 2. Reset isProcessed on all FeedbacksReceived
    await FeedbacksReceived.updateMany({}, { $set: { isProcessed: false } });
    console.log("Reset isProcessed flags.");

    // 3. Mock responses for empty forms
    const mockResponses = [
      {
        studentId: new mongoose.Types.ObjectId().toString(),
        answers: [
          "The professor is generally good but sometimes lacks clarity.",
          "Assignments are tough but helpful.",
          "Very open to questions in class.",
          "More visual aids would help.",
          "Good group projects.",
          "4", "3", "4", "4",
          "Yes", "Yes", "Yes", "Yes", "Just right", "Fairly aligned with the material covered", "Interactive lectures"
        ]
      },
      {
        studentId: new mongoose.Types.ObjectId().toString(),
        answers: [
          "A bit fast paced for me.",
          "The reading materials were excellent.",
          "Could be more approachable during office hours.",
          "Exams are very difficult.",
          "Enjoyed the guest speakers.",
          "3", "4", "3", "3",
          "No", "Yes", "Yes", "No", "Too fast", "Much harder than the material covered", "Independent research/reading"
        ]
      },
      {
        studentId: new mongoose.Types.ObjectId().toString(),
        answers: [
          "Great course overall.",
          "Everything was structured perfectly.",
          "Loved the hands on approach.",
          "No complaints.",
          "Best class this semester.",
          "5", "5", "5", "5",
          "Yes", "Yes", "Yes", "Yes", "Just right", "Fairly aligned with the material covered", "Practical/hands-on assignments"
        ]
      },
      {
        studentId: new mongoose.Types.ObjectId().toString(),
        answers: [
          "Too theoretical.",
          "Need more practical examples.",
          "Professor is very knowledgeable.",
          "Class participation could be encouraged more.",
          "Overall decent.",
          "3", "3", "4", "3",
          "Yes", "Yes", "No", "Yes", "Just right", "Fairly aligned with the material covered", "Group discussions/workshops"
        ]
      },
      {
        studentId: new mongoose.Types.ObjectId().toString(),
        answers: [
          "Amazing feedback on assignments.",
          "Lectures are engaging and fun.",
          "Sometimes disorganized.",
          "Hard to hear from the back of the room.",
          "Very supportive.",
          "4", "5", "4", "4",
          "Yes", "Yes", "Yes", "Yes", "Just right", "Fairly aligned with the material covered", "Interactive lectures"
        ]
      }
    ];

    const formsToMock = ["TCS102_C", "TCS102_A", "TCS101_B"];
    for (const formName of formsToMock) {
      await FeedbacksReceived.updateOne(
        { name: formName },
        { $set: { responses: mockResponses } }
      );
      console.log(`Mocked student responses for ${formName}.`);
    }

    // 4. Generate historical data for TCS101_A (John Doe) to populate the trends chart
    // We will generate 4 past months
    const historicalDocs = [];
    const baseScores = [
      { clarity: 3.2, doubtResolution: 3.0, practicalKnowledge: 3.5, overallRating: 3.2 }, // 4 months ago
      { clarity: 3.5, doubtResolution: 3.4, practicalKnowledge: 3.6, overallRating: 3.5 }, // 3 months ago
      { clarity: 3.8, doubtResolution: 3.9, practicalKnowledge: 4.0, overallRating: 3.9 }, // 2 months ago
      { clarity: 4.2, doubtResolution: 4.1, practicalKnowledge: 4.3, overallRating: 4.2 }, // 1 month ago
    ];

    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const pastDate = new Date();
      pastDate.setMonth(now.getMonth() - (4 - i));
      
      historicalDocs.push({
        feedbackForm: "TCS101_A",
        professorName: "John Doe",
        professorDepartment: "Computer Science and Engineering",
        strengths: ["Engaging lectures", "Clear explanations"],
        weaknesses: ["Exams are tough", "Pacing is fast"],
        metrics: {
          clarity: { average: baseScores[i].clarity, responses: 5 },
          doubtResolution: { average: baseScores[i].doubtResolution, responses: 5 },
          practicalKnowledge: { average: baseScores[i].practicalKnowledge, responses: 5 },
          overallRating: { average: baseScores[i].overallRating, responses: 5 }
        },
        processedAt: pastDate
      });
    }

    await ProcessedFeedback.insertMany(historicalDocs);
    console.log("Inserted 4 historical ProcessedFeedback documents for TCS101_A.");

    console.log("All DB mocking completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during simulation:", error);
    process.exit(1);
  }
};

runSimulation();
