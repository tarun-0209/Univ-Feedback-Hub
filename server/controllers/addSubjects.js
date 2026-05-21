const subjectsModel = require("../models/subjectsScheema");
const fs = require("fs");

const addSubjects = async (req, res) => {
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
  function convertCSVToObjects(csvData) {
    return csvData.map((data) => ({
      subjectCode: data.subjectCode,
      subjectName: data.subjectName,
      semester: data.semester,
      course: data.course,
    }));
  }
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file selected" });
    }

    // Read the uploaded CSV file
    const csvData = await parseCSV(req.file.path);

    // Convert CSV data to an array of objects suitable for MongoDB
    const formattedData = convertCSVToObjects(csvData);

    // Insert data into MongoDB using the UserModel
    await subjectsModel.insertMany(formattedData);

    res.json({ message: "CSV data uploaded successfully" });
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

module.exports = { addSubjects };
