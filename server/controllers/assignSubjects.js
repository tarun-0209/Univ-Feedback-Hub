const csv = require("csv-parser");
const fs = require("fs");
const Professor = require("../models/professorsScheema");
const Subject = require("../models/subjectsScheema");

async function assignSubjects(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file selected" });
    }

    // Function to parse csv file
    const parseCSV = (filePath) => {
      const results = [];
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (err) => reject(err));
      });
    };

    const csvData = await parseCSV(req.file.path);

    for (const row of csvData) {
      const { username, subjectCodes } = row;

      // Skip empty rows or malformed rows
      if (!username || !subjectCodes) continue;

      try {
        const professor = await Professor.findOne({ username });

        if (professor) {
          const subjectSections = subjectCodes.split(",");
          const assignments = [];

          for (const subjectSection of subjectSections) {
            const [subjectCode, section] = subjectSection.split(":");
            const subject = await Subject.findOne({ subjectCode: subjectCode.trim() });

            if (subject) {
              assignments.push({
                subject: subject._id,
                section: section.trim(),
              });
            } else {
              console.log(`Subject ${subjectCode} not found.`);
            }
          }

          await Professor.findByIdAndUpdate(professor._id, {
            $set: { subjects: assignments },
          });
        } else {
          console.log(`Professor ${username} not found.`);
        }
      } catch (error) {
        console.error(`Error assigning subjects to professor ${username}:`, error);
      }
    }

    console.log("CSV file processed successfully.");
    res.status(200).json({ message: "Subjects assigned successfully" });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
  }
}

module.exports = {
  assignSubjects,
};
