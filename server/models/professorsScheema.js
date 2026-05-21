const mongoose = require("mongoose");

const professorsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  subjects: [
    {
      subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subjects" },
      section: { type: String, required: true },
    },
  ],
  Department: { type: String, required: true },
  Designation: { type: String, required: true },
});

module.exports = mongoose.model("Professors", professorsSchema);
