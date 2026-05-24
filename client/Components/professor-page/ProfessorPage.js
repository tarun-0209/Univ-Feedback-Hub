import Header from "../student-page/Header";
import SideBar from "../student-page/SideBar";
import SearchBar from "../student-page/SearchBar";
import ProfessorCard from "./ProfessorCard";
import { useEffect, useState } from "react";
const BASE_URL = process.env.BASE_URL;

const ProfessorPage = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const professorId = userData._id;
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects(professorId);
  }, []);

  const fetchSubjects = async (professorId) => {
    try {
      // Make a GET request to your backend API endpoint to fetch subjects
      const response = await fetch(
        `${BASE_URL}/api/v1/getSubjects/${professorId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
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
            {subjects.map((subject) => (
              <ProfessorCard
                key={subject.id}
                {...subject}
                feedbackFormName={`${subject.subjectCode}_${subject.section}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorPage;
