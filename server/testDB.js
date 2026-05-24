const mongoose = require("mongoose");
const ProcessedFeedback = require("./models/processedFeedbacks");
require("dotenv").config();

mongoose
  .connect(process.env.DB_LINK)
  .then(async () => {
    console.log("Connected to DB");
    const docs = await ProcessedFeedback.find({});
    console.log("All ProcessedFeedbacks:", JSON.stringify(docs, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
