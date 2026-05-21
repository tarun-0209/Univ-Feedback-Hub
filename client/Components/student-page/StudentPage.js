import Header from "./Header";
import SideBar from "./SideBar";
import SubjectCard from "./SubjectCard";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const StudentPage = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const studentId = userData ? userData._id : null;
  const [subjects, setSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    fetchSubjects(studentId);
    fetchProfessors(studentId);
  }, []);

  const fetchSubjects = async (studentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/getSubjects/${studentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data.subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchProfessors = async (studentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/getProfessors/${studentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Professors");
      }
      const data = await response.json();
      setProfessors(data.professorsTeachingSubjects);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 md:p-3 bg-cyan-50 p-1">
        <SideBar />
        <div className="flex-1 flex flex-col  h-[calc(100vh-6rem)] overflow-y-auto">
          <SearchBar />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                        gap-3 md:gap-4 p-2 md:p-4 flex-1 overflow-auto"
          >
            {subjects.length > 0 &&
              professors.length === subjects.length &&
              subjects.map((subject, index) => (
                <SubjectCard
                  subjectName={subject.subjectName}
                  subjectCode={subject.subjectCode}
                  professorName={professors[index].professorName}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
