import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = process.env.BASE_URL;

const FeedbackFormBody = ({ feedbackFormData }) => {
  const [formObject, setFormObject] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormObject(feedbackFormData?.feedbackForm);
    setStartTime(feedbackFormData?.feedbackForm?.startTime);
    setDeadline(feedbackFormData?.feedbackForm?.deadline);

    const checkSubmissionStatus = async () => {
      const userDataString = localStorage.getItem("userData");
      const { _id } = userDataString ? JSON.parse(userDataString) : null;

      if (_id) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/v1/checkSubmissionStatus?studentId=${_id}&formId=${feedbackFormData?.feedbackForm?.name}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          const result = await response.json();
          setIsSubmitted(result.isSubmitted);
        } catch (error) {
          console.error("Error checking submission status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkSubmissionStatus();
  }, [feedbackFormData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const feedbackResponses = [];
    for (const [questionIndex, question] of formObject.questions.entries()) {
      let answer;

      if (question.type === "text") {
        answer = formData.get(`question-${questionIndex}-text`);
      } else if (question.type === "yesNo") {
        answer = formData.get(`question-${questionIndex}-yesNo`);
      } else if (question.type === "rating") {
        answer = formData.get(`question-${questionIndex}-rating`);
      } else if (question.type === "multiple") {
        answer = formData.get(`question-${questionIndex}-multiple`);
      }

      feedbackResponses.push(answer);
    }

    const userDataString = localStorage.getItem("userData");
    const { _id } = userDataString ? JSON.parse(userDataString) : null;
    const feedbackData = {
      name: formObject.name,
      responses: [
        {
          studentId: _id,
          answers: feedbackResponses,
        },
      ],
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/submitFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSuccessMessage("Feedback submitted successfully!");
      setErrorMessage(""); // Clear any previous error message
      setTimeout(() => {
        navigate("/student");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to submit feedback. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const start = new Date(startTime);
    const timeDiff = start - now;

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-5/6 h-[calc(100vh-6rem)]">
        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className=" flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-green-100 w-11/12">
          <h2 className="text-5xl font-semibold text-green-500 mb-2 text-center">
            Feedback Submitted
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            You have already submitted this feedback form. Thank you!
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  if (startTime && currentDate < new Date(startTime)) {
    const timeUntilStart = getTimeUntilStart();
    return (
      <div className="flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-yellow-100 w-11/12">
          <h2 className="text-5xl font-semibold text-yellow-500 mb-2 text-center">
            Form Not Available
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            This form will be available in:
          </p>
          <p className="text-xl text-gray-700 mb-4">
            {timeUntilStart.days} days, {timeUntilStart.hours} hours,{" "}
            {timeUntilStart.minutes} minutes, and {timeUntilStart.seconds}{" "}
            seconds.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (deadline && currentDate > new Date(deadline)) {
    return (
      <div className=" flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-red-100 w-11/12">
          <h2 className="text-5xl font-semibold text-red-500 mb-2 text-center">
            Deadline Passed
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this form is no longer accepting any responses.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (!formObject) {
    return (
      <div className=" flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-blue-100 w-11/12">
          <h2 className="text-5xl font-semibold text-blue-500 mb-2 text-center">
            Form Not Created
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this feedback form is not yet Created.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-2 w-5/6 md:w-5/6 h-[calc(100vh-6rem)] overflow-y-auto bg-cyan-50">
      <h3 className="px-5 py-2 text-xl md:text-2xl rounded-md bg-purple-400 font-bold text-white">
        Feedback Form
      </h3>
      <form onSubmit={handleSubmit}>
        {formObject && (
          <div className="py-4 md:px-10">
            {formObject.questions.map((question, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md shadow-md my-4 border border-teal-400"
              >
                <p className="text-lg font-semibold mb-2">
                  {question.description}
                </p>
                <div className="mt-2">
                  {question.type === "text" && (
                    <input
                      type="text"
                      name={`question-${index}-text`}
                      className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your answer"
                      required
                    />
                  )}
                  {question.type === "yesNo" && (
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}-yesNo`}
                        value="Yes"
                        className="mr-2"
                        required
                      />
                      <label className="mr-4">Yes</label>
                      <input
                        type="radio"
                        name={`question-${index}-yesNo`}
                        value="No"
                        className="mr-2"
                        required
                      />
                      <label>No</label>
                    </div>
                  )}
                  {question.type === "rating" && (
                    <div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center mr-2">
                            <input
                              type="radio"
                              name={`question-${index}-rating`}
                              value={value}
                              className="mr-1"
                              required
                            />
                            <label className="mr-2">{value}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {question.type === "multiple" && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${index}-multiple`}
                            value={option}
                            className="mr-2"
                            required
                          />
                          <label className="mr-4">{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white font-medium py-2 px-6 mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center min-w-[120px] ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 focus:ring-green-600 transition duration-300 ease-in-out"
            }`}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="flex justify-center items-center mt-4">
          <div className="bg-green-200 text-green-800 p-4 rounded">
            {successMessage}
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="flex justify-center items-center mt-4">
          <div className="bg-red-200 text-red-800 p-4 rounded">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackFormBody;
