import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { Link } from "react-router-dom";
const Profile = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const type = userData.type;
  const userId = userData._id;
  const [subjects, setSubjects] = useState([]);
  const storedProfile = localStorage.getItem("profileImage");
  const [profileImage, setProfileImage] = useState(
    (storedProfile && storedProfile.startsWith("data:image/")) ? storedProfile : null
  );

  require("dotenv").config();
  const BASE_URL = process.env.BASE_URL;

  useEffect(() => {
    fetchSubjects(userId);
  }, [userId]);

  const fetchSubjects = async (userId) => {
    try {
      // Make a GET request to your backend API endpoint to fetch subjects
      const response = await fetch(`${BASE_URL}/api/v1/getSubjects/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      //console.log("Received subjects:", data.subjects);
      setSubjects(data.subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size should be less than 1 MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem("profileImage", base64String);
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
    window.location.href = `/user/${userId}`;
  };

  return (
    <div className="">
      <Header />
      <div className="flex md:p-3 p-1">
        <SideBar />
        <div className=" h-[calc(100vh-6rem)] overflow-y-auto rounded-lg w-5/6 px-5 py-2">
          <div
            className={`px-6 py-8 flex items-center justify-between ${
              type === "student" ? "bg-purple-500" : "bg-emerald-500"
            } text-white`}
          >
            <h1 className="text-3xl font-bold">
              {type === "student" ? "Student Profile" : "Professor Profile"}
            </h1>
          </div>
          <div className="px-3 py-6 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="mb-4 text-xl">
                  <span className="font-bold">Name :</span> {userData.name}
                </div>
              </div>
              <div className="flex flex-col items-center">
                {profileImage ? (
                  <>
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full mb-2"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded text-sm"
                    >
                      Edit Image
                    </label>
                  </>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Upload Image
                  </label>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            {type === "professor" && (
              <>
                <div className="mb-4 text-lg">
                  <span className="font-bold">Department :</span>{" "}
                  {userData.Department}
                </div>
                <div className="mb-4 text-lg">
                  <span className="font-bold">Designation :</span>{" "}
                  {userData.Designation}
                </div>
              </>
            )}

            {type === "student" && (
              <>
                <div className="mb-4 text-lg">
                  <span className="font-bold">Course :</span> {userData.course}
                </div>
                <div className="mb-4 text-lg">
                  <span className="font-bold">Semester :</span>{" "}
                  {userData.semester}
                </div>
                <div className="mb-4 text-lg">
                  <span className="font-bold">Section :</span>{" "}
                  {userData.section}
                </div>
              </>
            )}
            <div className="mb-2 text-lg">
              <span className="font-bold">Subjects :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.subjectCode + subject.section}
                  className="bg-gray-100 p-4 rounded shadow-md"
                >
                  <h2 className="text-xl font-bold mb-2">
                    {subject.subjectName} ({subject.subjectCode})
                  </h2>
                  {type !== "student" && (
                    <div>
                      <p className="mb-1">
                        <span className="font-bold">Section:</span>{" "}
                        {subject.section}
                      </p>
                      <p className="mb-1">
                        <span className="font-bold">Course:</span>{" "}
                        {subject.course}
                      </p>
                      <Link
                        to={`/user/${userId}/FeedbackAnalysis_AI/${
                          subject.subjectCode + "_" + subject.section
                        }`}
                        className="px-4 py-2.5 bg-emerald-500 text-white font-semibold shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all block text-center"
                      >
                        View Processed Feedbacks
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
