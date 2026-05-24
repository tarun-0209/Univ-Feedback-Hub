import React, { useEffect, useState } from "react";
const BASE_URL = process.env.BASE_URL;
const AdminContactRequests = () => {
  // State to store admin contact requests
  const [adminContactRequests, setAdminContactRequests] = useState([]);

  // Function to fetch admin contact requests from the backend
  const fetchAdminContactRequests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/professorQueries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch admin contact requests");
      }
      const data = await response.json();
      setAdminContactRequests(data);
    } catch (error) {
      console.error("Error fetching admin contact requests:", error);
    }
  };

  useEffect(() => {
    fetchAdminContactRequests();
  }, []);

  // Function to handle accepting or Rejecting a request
  const handleStatusRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/professorQueries/${requestId}/${status}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to ${status} request`);
      }
      // Remove the accepted request from the list
      setAdminContactRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-35vh)] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Check Professor Queries related to Feedback Form
      </h2>
      <ul className="list-none divide-y divide-gray-200 divide-dashed">
        {adminContactRequests.map((request) => (
          <li
            key={request._id}
            className="py-4 px-2 flex flex-col space-y-2 bg-white rounded-md shadow-md mb-2"
          >
            <div className="flex justify-between items-center bg-gray-200 p-2 rounded-md">
              <p className="text-gray-700 font-medium">
                Professor ID: {request.professorId}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(request.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-gray-600">Student ID: {request.studentId}</p>
              <p className="text-gray-600">Form Name: {request.formName}</p>
              <p className="text-gray-600">Question: {request.question}</p>
              <p className="text-gray-600">Answer: {request.answer}</p>
              <p className="text-gray-600">Reason: {request.reason}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStatusRequest(request._id, "accepted")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusRequest(request._id, "rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Reject
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminContactRequests;
