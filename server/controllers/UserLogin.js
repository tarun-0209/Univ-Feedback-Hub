const StudentModel = require("../models/studentsScheema");
const ProfessorModel = require("../models/professorsScheema");
const AdminModel = require("../models/AdminScheema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await Promise.all([
      AdminModel.findOne({ username }),
      ProfessorModel.findOne({ username }),
      StudentModel.findOne({ username }),
    ]);
    const user = results.find(Boolean);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let isMatch = false;
    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (isMatch) {
      const token = jwt.sign(
        { _id: user._id, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({ message: "Login successful!", data: user, token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { UserLogin };
