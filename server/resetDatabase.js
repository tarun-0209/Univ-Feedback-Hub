require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import all models
const AdminModel = require("./models/AdminScheema");
const FeedbackForm = require("./models/FeedbackFormScheema");
const FeedbacksReceived = require("./models/FeedbacksReceived");
const ProcessedFeedback = require("./models/processedFeedbacks");
const Professors = require("./models/professorsScheema");
const Students = require("./models/studentsScheema");
const Subjects = require("./models/subjectsScheema");

const resetDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_LINK);
    console.log("Connected successfully!");

    console.log("Erasing collections...");
    await AdminModel.deleteMany({});
    await FeedbackForm.deleteMany({});
    await FeedbacksReceived.deleteMany({});
    await ProcessedFeedback.deleteMany({});
    await Professors.deleteMany({});
    await Students.deleteMany({});
    await Subjects.deleteMany({});
    console.log("All legacy data has been erased!");

    console.log("Re-seeding initial admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newAdmin = new AdminModel({
      username: "admin",
      password: hashedPassword,
      name: "Super Admin",
      address: "Admin HQ",
      type: "admin",
    });

    await newAdmin.save();
    console.log("Database reset complete!");

    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
};

// Execute the reset
resetDatabase();
