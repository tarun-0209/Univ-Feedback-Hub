import React, { useState } from "react";
import axios from "axios";
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const AddSubjects = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    setMessage(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/addSubjects`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message || "Subjects added successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please check your network connection or file format.");
    } finally {
      setIsUploading(false);
      setTimeout(() => { setMessage(null); setError(null); }, 5000);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-center justify-center py-4">
      <h2 className="text-xl font-medium text-gray-800">
        Upload CSV File to Add Subjects into the System
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
          disabled={isUploading}
          className={`text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center min-w-[100px] ${
            isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 focus:ring-blue-700"
          }`}
        >
          {isUploading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Upload"
          )}
        </button>
      </div>
      {message && <div className="mt-2 text-green-600 bg-green-100 px-4 py-2 rounded-md font-semibold w-full text-center max-w-md">{message}</div>}
      {error && <div className="mt-2 text-red-600 bg-red-100 px-4 py-2 rounded-md font-semibold w-full text-center max-w-md">{error}</div>}
    </div>
  );
};

export default AddSubjects;
