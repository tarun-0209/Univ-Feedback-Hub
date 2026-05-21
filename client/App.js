import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./Components/Home-page/Home";
import AdminPage from "./Components/admin-page/AdminPage";
import ProfessorPage from "./Components/professor-page/ProfessorPage";
import StudentPage from "./Components/student-page/StudentPage";
import Profile from "./Components/student-page/Profile";
import GiveFeedback from "./Components/student-page/GiveFeedback";
import SeeFeedback from "./Components/professor-page/SeeFeedback";
import ErrorPage from "./Components/Home-page/ErrorComponent";
import StudentNotifications from "./Components/student-page/Notifications";
import ProfessorNotification from "./Components/professor-page/ProfessorNotification";
import ContactPage from "./Components/student-page/Contact";
import SummaryOfFeedbacks from "./Components/professor-page/SummaryOfFeedbacks";
import GuestPage from "./Components/guest-page/GuestPage";
function useUserType() {
  const userDataString = localStorage.getItem("userData");
  const { type } = userDataString ? JSON.parse(userDataString) : { type: null };
  return type;
}

function useRoutesForUser(userType) {
  switch (userType) {
    case "admin":
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      );
    case "guest":
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      );
    case "professor":
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/professor" element={<ProfessorPage />} />
          <Route path="/user/:_id" element={<Profile />} />
          <Route
            path="/user/:_id/FeedbackAnalysis_AI/:feedbackFormName"
            element={<SummaryOfFeedbacks />}
          />
          <Route
            path="/seeFeedback/:feedbackFormName"
            element={<SeeFeedback />}
          />
          <Route
            path="/professor/notifications"
            element={<ProfessorNotification />}
          />
          <Route path="/professor/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      );
    case "student":
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/user/:_id" element={<Profile />} />
          <Route
            path="/giveFeedback/:feedbackFormName"
            element={<GiveFeedback />}
          />
          <Route
            path="/student/notifications"
            element={<StudentNotifications />}
          />
          <Route path="/student/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      );
  }
}

const AppLayout = () => {
  const userType = useUserType();
  const routes = useRoutesForUser(userType);

  return <div>{routes}</div>;
};

const root = ReactDOM.createRoot(document.getElementById("main-root"));
root.render(
  <Router>
    <AppLayout />
  </Router>
);
