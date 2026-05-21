import React, { useState } from "react";
import axios from "axios";
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const RegisterStudents = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/registerUser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message); // Display success message from server
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup Error:", error.message);
      }
      alert("Error uploading file. Please check your network connection.");
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-center justify-center py-4">
      <h2 className="text-xl font-medium text-gray-800">
        Upload CSV File To Register Students for this Semester into the System
      </h2>
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2">
        <input
          type="file"
          accept=".csv"
          className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleFileUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default RegisterStudents;
