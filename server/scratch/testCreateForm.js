const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const testCSV = () => {
  const filePath = path.join("..", "csv data", "_assignSubjects.csv");
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      console.log(row);
    })
    .on("end", () => {
      console.log("Done");
    });
};
testCSV();
