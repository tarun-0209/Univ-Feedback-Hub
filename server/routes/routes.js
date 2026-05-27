const express = require("express");
const Router = express.Router();
const { RegisterUsers } = require("../../server/controllers/RegisterStudents");
const multer = require("multer");
const upload = multer({ 
  dest: "TempUploads/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
const { UserLogin } = require("../../server/controllers/UserLogin");
const { addSubjects } = require("../../server/controllers/addSubjects");
const {
  RegisterProfessors,
} = require("../../server/controllers/RegisterProfessors");
const { assignSubjects } = require("../../server/controllers/assignSubjects");
const { getSubjects } = require("../../server/controllers/getSubjects");
const { getProfessors } = require("../controllers/getProfessors");
const { saveFeedbackForm } = require("../controllers/saveFeedbackForm");
const { getFeedbackFormByName } = require("../controllers/getFeedbackForm");
const { submitFeedback } = require("../controllers/submitFeedback");
const { getFeedbackData } = require("../controllers/getfeedbackResponses");
const { RegisterAdmins } = require("../controllers/RegisterAdmins");
const {
  checkSubmissionStatus,
} = require("../controllers/checkSubmissionStatus");
const { saveReplyData } = require("../controllers/professorReply");
const { getReplyData } = require("../controllers/getReply");
const { contactAdmin } = require("../controllers/contactAdmin");
const { showProfessorQuery } = require("../controllers/showProfessorQueries");
const { showProfNotifications } = require("../controllers/profNotification");
const { getStudentDetails } = require("../controllers/getStudentDetails");
const {
  handleStatusRequest,
} = require("../controllers/handleProfessorRequest");
const { createContact } = require("../controllers/contact");
const { processFeedbacksAI } = require("../controllers/processFeedbacks");
const {
  getProcessedFeedbacks,
} = require("../controllers/getProcessedFeedbacks");
const { getDepartmentAverages } = require("../controllers/getDepartmentAvgs");
const { peerComparision } = require("../controllers/peerComparision");
const {
  getActionableInsights,
} = require("../controllers/getActionableInsights");

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Admin Only Routes
Router.post("/registerAdmins", requireAuth, requireRole(["admin"]), upload.single("file"), RegisterAdmins);
Router.post("/registerUser", requireAuth, requireRole(["admin"]), upload.single("file"), RegisterUsers);
Router.post("/addSubjects", requireAuth, requireRole(["admin"]), upload.single("file"), addSubjects);
Router.post("/registerProfessors", requireAuth, requireRole(["admin"]), upload.single("file"), RegisterProfessors);
Router.post("/assignSubjects", requireAuth, requireRole(["admin"]), upload.single("file"), assignSubjects);
Router.get("/processFeedbacks", requireAuth, requireRole(["admin"]), processFeedbacksAI);
Router.post("/createFeedbackForm", requireAuth, requireRole(["admin"]), saveFeedbackForm);
Router.get("/professorQueries", requireAuth, requireRole(["admin"]), showProfessorQuery);
Router.post("/professorQueries/:requestId/:status", requireAuth, requireRole(["admin"]), handleStatusRequest);

// Student & Professor Routes
Router.get("/getSubjects/:studentId", requireAuth, requireRole(["student", "professor"]), getSubjects);
Router.get("/feedback/:feedbackFormName", requireAuth, requireRole(["student", "professor"]), getFeedbackFormByName);

// Student Only Routes
Router.get("/getProfessors/:studentId", requireAuth, requireRole(["student"]), getProfessors);
Router.post("/submitFeedback", requireAuth, requireRole(["student"]), submitFeedback);
Router.get("/checkSubmissionStatus", requireAuth, requireRole(["student"]), checkSubmissionStatus);

// Professor Only Routes
Router.get("/getfeedbackResponses/:feedbackFormName", requireAuth, requireRole(["professor"]), getFeedbackData);
Router.get("/professorQueries/:_id", requireAuth, requireRole(["professor"]), showProfNotifications);
Router.get("/getProcessedFeedbacks/:professorName/:feedbackFormName", requireAuth, requireRole(["professor"]), getProcessedFeedbacks);
Router.get("/department-averages/:department", requireAuth, requireRole(["professor"]), getDepartmentAverages);
Router.get("/peer-rankings/:department", requireAuth, requireRole(["professor"]), peerComparision);
Router.post("/generate-insights", requireAuth, requireRole(["professor"]), getActionableInsights);

// Admin & Professor Routes
Router.post("/contactAdmin", requireAuth, requireRole(["professor"]), contactAdmin); // Only Professor contacts Admin

// Shared / Other Routes
Router.post("/login", UserLogin);
Router.post("/submitReply", requireAuth, saveReplyData);
Router.get("/getReply/:_id", requireAuth, getReplyData);
Router.get("/getStudentDetails/:studentId", requireAuth, getStudentDetails);
Router.post("/contactUs", requireAuth, createContact);

module.exports = Router;
