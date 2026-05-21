const express = require("express");
const Router = express.Router();
const { RegisterUsers } = require("../../server/controllers/RegisterStudents");
const multer = require("multer");
const upload = multer({ dest: "TempUploads/" });
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

Router.post("/registerUser", requireAuth, upload.single("file"), RegisterUsers);
Router.post("/login", UserLogin);
Router.post("/addSubjects", requireAuth, upload.single("file"), addSubjects);
Router.post("/registerProfessors", requireAuth, upload.single("file"), RegisterProfessors);
Router.post("/assignSubjects", requireAuth, upload.single("file"), assignSubjects);
Router.get("/getSubjects/:studentId", requireAuth, getSubjects);
Router.get("/getProfessors/:studentId", requireAuth, getProfessors);
Router.post("/createFeedbackForm", requireAuth, saveFeedbackForm);
Router.get("/feedback/:feedbackFormName", requireAuth, getFeedbackFormByName);
Router.post("/submitFeedback", requireAuth, submitFeedback);
Router.get("/getfeedbackResponses/:feedbackFormName", requireAuth, getFeedbackData);
Router.post("/registerAdmins", upload.single("file"), RegisterAdmins); // Left public for initial setup
Router.get("/checkSubmissionStatus", requireAuth, checkSubmissionStatus);
Router.post("/submitReply", requireAuth, saveReplyData);
Router.get("/getReply/:_id", requireAuth, getReplyData);
Router.post("/contactAdmin", requireAuth, contactAdmin);
Router.get("/professorQueries", requireAuth, showProfessorQuery);
Router.get("/professorQueries/:_id", requireAuth, showProfNotifications);
Router.get("/getStudentDetails/:studentId", requireAuth, getStudentDetails);
Router.post("/professorQueries/:requestId/:status", requireAuth, handleStatusRequest);
Router.post("/contactUs", requireAuth, createContact);
Router.get("/processFeedbacks", requireAuth, processFeedbacksAI);
Router.get(
  "/getProcessedFeedbacks/:professorName/:feedbackFormName",
  requireAuth,
  getProcessedFeedbacks
);
Router.get("/department-averages/:department", requireAuth, getDepartmentAverages);
Router.get("/peer-rankings/:department", requireAuth, peerComparision);
Router.post("/generate-insights", requireAuth, getActionableInsights);

module.exports = Router;
