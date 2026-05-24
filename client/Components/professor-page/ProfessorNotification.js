import React, { useEffect, useState } from "react";
import Header from "../student-page/Header";
import SideBar from "../student-page/SideBar";
const BASE_URL = process.env.BASE_URL;

const ProfessorNotification = () => {
  const [profContactRequests, setProfRequests] = useState([]);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const userDataString = localStorage.getItem("userData");
  const { _id } = userDataString ? JSON.parse(userDataString) : "";

  const fetchProfContactRequests = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/professorQueries/${_id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Professor contact requests");
      }
      const data = await response.json();
      setProfRequests(data);
    } catch (error) {
      console.error("Error fetching Professor contact requests:", error);
    }
  };

  useEffect(() => {
    fetchProfContactRequests();
  }, []);

  const handleStudentInfoToggle = async (index, request) => {
    if (selectedRequestIndex === index) {
      setSelectedRequestIndex(null);
      setStudentInfo(null);
      setStatusMessage("");
    } else {
      if (request.status === "accepted") {
        try {
          const response = await fetch(
            `${BASE_URL}/api/v1/getStudentDetails/${request.studentId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          if (!response.ok) {
            throw new Error("Failed to get student info");
          }
          const data = await response.json();
          setStudentInfo(data);
          setSelectedRequestIndex(index);
          setStatusMessage("");
        } catch (error) {
          console.error("Error getting student info:", error);
        }
      } else {
        setStudentInfo(null);
        setSelectedRequestIndex(index);
        setStatusMessage(
          request.status === "pending"
            ? "This request is still pending."
            : "This request has been rejected."
        );
      }
    }
  };

  return (
    <div className="">
      <Header />
      <div className="flex md:p-3 bg-cyan-50 p-1">
        <SideBar></SideBar>
        <div className="w-5/6 h-[calc(100vh-6rem)] overflow-y-auto ">
          <h3 className="px-5 py-2  text-2xl rounded-md bg-purple-400 font-bold text-white  mx-3 my-1">
            Your Contact Requests
          </h3>
          <ul className=" p-2.5">
            {profContactRequests
              .slice()
              .reverse()
              .map((request, index) => (
                <li
                  key={request._id}
                  className=" rounded-lg shadow-md p-6 my-6 border border-cyan-200 bg-slate-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-500">
                        Requested at:{" "}
                        {new Date(request.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStudentInfoToggle(index, request)}
                      className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                    >
                      {selectedRequestIndex === index
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Form Name: {request.formName}
                    </p>
                    <p className="text-gray-600">
                      Question: {request.question}
                    </p>
                    <p className="text-gray-600">Answer: {request.answer}</p>
                    <p className="text-gray-600">Reason: {request.reason}</p>
                  </div>
                  {selectedRequestIndex === index && (
                    <div className="">
                      {statusMessage ? (
                        <div
                          className={`p-4 text-sm rounded-lg ${
                            statusMessage.includes("pending")
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {statusMessage}
                        </div>
                      ) : (
                        studentInfo && (
                          <div className="p-4 bg-green-100 text-green-700">
                            <h2 className="text-lg font-semibold text-gray-800">
                              Student Info:
                            </h2>
                            <p className="">
                              Course: {studentInfo.studentData.course}
                            </p>
                            <p className="">
                              Semester: {studentInfo.studentData.semester}
                            </p>
                            <p className="">
                              Name: {studentInfo.studentData.name}
                            </p>
                            <p className="">
                              Section: {studentInfo.studentData.section}
                            </p>
                            <p className="">
                              Student Id: {studentInfo.studentData.username}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfessorNotification;
