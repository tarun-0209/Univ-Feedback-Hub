import Header from "../student-page/Header";
import AddSubjects from "./AddSubjects";
import AssignSubjects from "./AssignSubjects";
import RegisterProfessors from "./RegisterProfessors";
import Register from "./RegisterStudents";
import WelcomeMsg from "./WelcomeMsg";
import CreateFeedbackForm from "./CreateFeedbackForm";
import { useState } from "react";
import RegisterAdmins from "./RegisterAdmin";
import AdminContactRequests from "./ProfessorRequests";
import Jadu from "./Jadu";

const tabs = [
  {
    id: "register admins",
    label: "Register Admins ",
    component: <RegisterAdmins />,
  },
  {
    id: "addSubjects",
    label: "Add Subjects ",
    component: <AddSubjects />,
  },
  {
    id: "register",
    label: "Register Students ",
    component: <Register />,
  },
  {
    id: "registerProfessors",
    label: "Register Professors ",
    component: <RegisterProfessors />,
  },
  {
    id: "assignSubjects",
    label: "Assign Subjects to Professors ",
    component: <AssignSubjects />,
  },
  {
    id: "createFeedBackForm",
    label: "Create a Feedback Form",
    component: <CreateFeedbackForm />,
  },
  {
    id: "professorQueries",
    label: "Check Professor Queries",
    component: <AdminContactRequests />,
  },
  {
    id: "Jadu",
    label: "Process Feedbacks",
    component: <Jadu />,
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(null); // Initial state for active tab

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="">
      <Header />
      <div className="flex px-4 py-1.5 flex-col md:flex-row h-[calc(100vh-5rem)] ">
        <nav className="bg-gray-800 text-white rounded-lg shadow-md my-3 mx-4 md:overflow-y-auto">
          <ul className="flex flex-col space-y-2 p-4">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer hover:bg-gray-700 py-2 px-4 rounded-lg text-lg font-semi-bold text-center ${
                  activeTab === tab.id ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border my-3 px-6 py-6 shadow-xl bg-cyan-50 mx-4 rounded-md h-auto md:w-full">
          <div className="border-b-2 border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2 md:text-xl">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
          </div>
          <div className="">
            {activeTab === null ? (
              <WelcomeMsg />
            ) : (
              tabs.find((tab) => tab.id === activeTab)?.component
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
