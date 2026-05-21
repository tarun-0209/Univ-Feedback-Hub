const UserModel = require("../models/studentsScheema");
const SubjectsModel = require("../models/subjectsScheema");
const fs = require("fs");
const bcrypt = require("bcrypt");

const RegisterUsers = async (req, res) => {
  // Function to parse csv file
  function parseCSV(filePath) {
    const csv = require("csv-parser");
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  }

  // Function to convert CSV data to objects
  async function convertCSVToObjects(csvData) {
    return await Promise.all(csvData.map(async (data) => ({
      username: data.username,
      password: await bcrypt.hash(data.password, 10),
      name: data.name,
      course: data.course,
      address: data.address,
      type: data.type,
      semester: data.semester,
      section: data.classSection,
    })));
  }
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file selected" });
    }

    // Read the uploaded CSV file
    const csvData = await parseCSV(req.file.path);

    // Convert CSV data to an array of objects suitable for MongoDB
    const formattedData = await convertCSVToObjects(csvData);

    // Insert data into MongoDB using the UserModel
    await UserModel.insertMany(formattedData);

    // Find all users
    const users = await UserModel.find({});

    // Loop through each user and assign subjects
    for (const user of users) {
      // Find subjects matching user's semester and course
      const subjects = await SubjectsModel.find({
        semester: user.semester,
        course: user.course,
      });

      // Update user document with subject IDs (or relevant information)
      user.subjects = subjects.map((subject) => subject._id);

      // Optional: Handle no matching subjects
      if (subjects.length === 0) {
        console.log(
          `No subjects found for user: ${user.username}, course: ${user.course}, semester: ${user.semester}`
        );
      }

      await user.save();
    }
    res.json({
      message: "CSV data uploaded and subjects assigned successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading CSV data" });
  } finally {
    // Clean up the uploaded file (optional)
    if (req && req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = { RegisterUsers };
