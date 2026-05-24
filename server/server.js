require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { processFeedbacksCron } = require("./controllers/processFeedbacks");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

mongoose
  .connect(process.env.DB_LINK, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const routes = require("./routes/routes");
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("server home");
});
// Start Cron Job
const cron = require("node-cron");
cron.schedule("0 * * * *", processFeedbacksCron); // Runs every hour

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
  // Run on startup to catch any missed jobs while server was asleep
  processFeedbacksCron();
});
