const mongoose = require("mongoose");
const FeedbacksReceived = require("./models/FeedbacksReceived");
require("dotenv").config();

mongoose
  .connect(process.env.DB_LINK)
  .then(async () => {
    console.log("Connected to DB");
    const docs = await FeedbacksReceived.find({});
    console.log("All FeedbacksReceived:", JSON.stringify(docs, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
