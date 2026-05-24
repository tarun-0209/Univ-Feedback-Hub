const ProfessorsModel = require("../models/professorsScheema");
const SubjectsModel = require("../models/subjectsScheema");
const fs = require("fs");
const bcrypt = require("bcrypt");

const RegisterProfessors = async (req, res) => {
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

  async function convertCSVToObjects(csvData) {
    const validData = csvData.filter((data) => data.username && data.password);
    return await Promise.all(validData.map(async (data) => ({
      username: data.username,
      password: await bcrypt.hash(data.password, 10),
      name: data.name,
      address: data.address,
      type: data.type,
      Department: data.Department,
      Designation: data.Designation,
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
    await ProfessorsModel.insertMany(formattedData);

    res.json({
      message: "CSV data uploaded *and subjects assigned* successfully",
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

module.exports = { RegisterProfessors };
