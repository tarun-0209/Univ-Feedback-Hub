require("dotenv").config();
const mongoose = require("mongoose");
const Professors = require("../models/professorsScheema");

const checkProfs = async () => {
  try {
    await mongoose.connect(process.env.DB_LINK);
    const profs = await Professors.find({});
    console.log(JSON.stringify(profs, null, 2));
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};
checkProfs();
