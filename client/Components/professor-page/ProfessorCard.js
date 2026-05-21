import { Link } from "react-router-dom";

// ProfessorCard.js - Updated Card Component
const ProfessorCard = ({ ...props }) => {
  return (
    <div
      className="p-3 md:p-4 my-2 border-2 border-green-300 w-full h-full 
                   shadow-md rounded-lg hover:shadow-lg bg-green-100 
                   transition-all duration-200 ease-in-out
                   flex flex-col justify-between"
    >
      <div>
        <h2
          className="mb-2 text-center font-semibold text-base md:text-lg lg:text-xl 
                      truncate px-2"
          title={props.subjectName}
        >
          {props.subjectName}
        </h2>
        <h3 className="mb-2 text-center text-sm md:text-base">
          <span className="font-bold">Code:</span> {props.subjectCode}
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col space-y-1 text-xs md:text-sm lg:text-base mb-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Semester:</span>
            <span>{props.semester}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Course:</span>
            <span className="truncate">{props.course}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Section:</span>
            <span>{props.section}</span>
          </div>
        </div>

        <Link
          to={`/seeFeedback/${props.feedbackFormName}`}
          className="w-full text-center text-white border-2 border-green-700 
                   py-1 md:py-2 px-2 bg-green-500 rounded-md hover:bg-green-600 
                   text-xs md:text-sm font-semibold transition-all
                   flex items-center justify-center"
        >
          See Feedback
        </Link>
      </div>
    </div>
  );
};

export default ProfessorCard;
