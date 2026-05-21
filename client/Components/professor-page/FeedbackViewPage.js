import React, { useState, useEffect, useRef } from "react";
import PieChart from "./Piechart";
import BarChart from "./Barchart";
import "./FeedbackViewPage.css";
import { useNavigate } from "react-router-dom";
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const FeedbackViewPage = ({ feedbackFormName }) => {
  const [questions, setQuestions] = useState([]);
  const [feedbackResponses, setFeedbackResponses] = useState([]);
  const [textAnswers, setTextAnswers] = useState([]);
  const [yesNoData, setYesNoData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [multipleChoiceData, setMultipleChoiceData] = useState([]);
  const [multipleChoiceLabels, setMultipleChoiceLabels] = useState([]);
  const [activeResponseType, setActiveResponseType] = useState("");
  const [activeQuestionDescription, setActiveQuestionDescription] =
    useState("");
  const [reply, setReply] = useState("");
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [contactAdminIndex, setContactAdminIndex] = useState(null);
  const [reason, setReason] = useState("");
  const userDataString = localStorage.getItem("userData");
  const { _id } = userDataString ? JSON.parse(userDataString) : "";
  const navigate = useNavigate();

  // Fetch feedback questions from the backend
  const fetchFeedbackQuestions = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/feedback/${feedbackFormName}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback questions");
      }
      const data = await response.json();
      const extractedQuestions = data.feedbackForm.questions.map(
        (question) => ({
          description: question.description,
          type: question.type,
        })
      );
      setQuestions(extractedQuestions);
    } catch (error) {
      console.error("Error fetching feedback questions:", error);
    }
  };

  // Fetch feedback Responses from the backend
  const fetchFeedbackResponses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/getfeedbackResponses/${feedbackFormName}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback data");
      }
      const data = await response.json();
      setFeedbackResponses(data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackResponses();
    fetchFeedbackQuestions();
  }, [feedbackFormName]);

  const handleShowResponses = (index) => {
    if (!feedbackResponses || feedbackResponses.length === 0) {
      console.error("No feedback responses data available.");
      return;
    }

    const selectedQuestionResponses = feedbackResponses[0].responses;
    if (!selectedQuestionResponses || selectedQuestionResponses.length === 0) {
      console.error("No responses available for this question.");
      return;
    }

    const selectedQuestionAnswers = {
      questionType: questions[index].type,
      answers: selectedQuestionResponses.map(
        (response) => response.answers[index]
      ),
    };

    setActiveResponseType(selectedQuestionAnswers.questionType);
    setActiveQuestionDescription(questions[index].description);

    switch (selectedQuestionAnswers.questionType) {
      case "text":
        setTextAnswers(selectedQuestionAnswers.answers.filter(Boolean));
        break;
      case "yesNo":
        const yesCount = selectedQuestionAnswers.answers.filter(
          (answer) => answer === "Yes"
        ).length;
        const noCount = selectedQuestionAnswers.answers.filter(
          (answer) => answer === "No"
        ).length;
        setYesNoData([yesCount, noCount]);
        break;
      case "rating":
        const ratings = selectedQuestionAnswers.answers.map(Number);
        const ratingCounts = Array.from(
          { length: 5 },
          (_, i) => ratings.filter((rating) => rating === i + 1).length
        );
        setRatingData(ratingCounts);
        break;
      case "multiple":
        const answerCounts = selectedQuestionAnswers.answers.reduce(
          (acc, answer) => {
            acc[answer] = (acc[answer] || 0) + 1;
            return acc;
          },
          {}
        );
        const labels = Object.keys(answerCounts);
        const counts = Object.values(answerCounts);
        setMultipleChoiceData(counts);
        setMultipleChoiceLabels(labels);
        break;
      default:
        break;
    }
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = async (
    index,
    activeQuestionDescription,
    answer
  ) => {
    const replyData = {
      studentId: feedbackResponses[0].responses[index].studentId,
      formName: feedbackFormName,
      question: activeQuestionDescription,
      answer: answer,
      reply: reply,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/v1/submitReply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      console.log("Reply submitted successfully");

      setActiveReplyIndex(null);
      setReply("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const toggleReplyInput = (index) => {
    setActiveReplyIndex(index === activeReplyIndex ? null : index);
  };

  const handleContactAdminChange = (event) => {
    setReason(event.target.value);
  };

  const handleContactAdminSubmit = async (
    index,
    activeQuestionDescription,
    answer
  ) => {
    const contactAdminData = {
      professorId: _id,
      studentId: feedbackResponses[0].responses[index].studentId,
      formName: feedbackFormName,
      question: activeQuestionDescription,
      answer: answer,
      reason,
    };
    //console.log(contactAdminData);

    await fetch(`${BASE_URL}/api/v1/contactAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(contactAdminData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to contact admin");
        }
        setContactAdminIndex(null);
        setReason("");
      })
      .catch((error) => {
        console.error("Error contacting admin:", error);
      });
  };

  const toggleContactAdminInput = (index) => {
    setContactAdminIndex(index === contactAdminIndex ? null : index);
  };
  const [replyInput, setReplyInput] = useState(false);
  const replyRef = useRef(null);
  const [reportInput, setReportInput] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (replyInput && replyRef.current) {
      replyRef.current.focus();
    }
    if (reportInput && reportRef.current) {
      reportRef.current.focus();
    }
  }, [replyInput, reportInput]);

  if (questions.length === 0) {
    return (
      <div className=" flex items-center justify-center">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-blue-100 w-11/12">
          <h2 className="text-5xl font-semibold text-blue-500 mb-2 text-center">
            Form Not Created
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this feedback form is not yet Created.
          </p>
          <button
            onClick={() => navigate("/professor")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (feedbackResponses.length === 0) {
    return (
      <div className=" flex items-center justify-center">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-blue-100 w-11/12">
          <h2 className="text-5xl font-semibold text-blue-500 mb-2 text-center">
            Responses not Received
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this feedback form has no responses right now.
          </p>
          <button
            onClick={() => navigate("/professor")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-view-page flex justify-center mx-6 my-3">
      <div className="questions-container h-[calc(100vh-6rem)] overflow-y-auto px-5 py-5  bg-cyan-50 border border-cyan-200">
        <div className=" flex justify-between items-center">
          <h1 className="title">Feedback Questions</h1>
          <button
            onClick={() => navigate("/professor")}
            className="bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="question-card border">
              <p className="question-description py-2">
                Ques {index + 1 + "=>"} {question.description}
              </p>
              <button
                onClick={() => {
                  handleShowResponses(index);
                }}
                className="show-responses-btn"
              >
                Show Responses
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
        className="responses-container h-[calc(100vh-6rem)] overflow-y-auto px-5 py-5  bg-cyan-50 border border-cyan-200"
        id="responses"
      >
        {activeQuestionDescription && (
          <div className="text-answers">
            <h3 className="subtitle"> Current Question:</h3>
            <div className=" font-normal text-xl bg-blue-200 border border-blue-400 py-3 px-2 rounded-md">
              Ques - {activeQuestionDescription}
            </div>
          </div>
        )}
        {activeResponseType === "text" && textAnswers.length > 0 && (
          <div className="text-answers">
            <ul className="answers-list">
              {textAnswers.map((answer, index) => (
                <li key={index} className="answer-item border">
                  <div className=" px-2 py-3.5 bg-green-100 m-1 rounded-lg">
                    {answer}
                  </div>

                  <button
                    onClick={() => {
                      toggleReplyInput(index);
                      setReplyInput(!replyInput);
                    }}
                    className=" border px-5 py-1 bg-black text-white font-semibold rounded-md m-1"
                  >
                    {activeReplyIndex === index ? "Cancel" : "Reply"}
                  </button>
                  {activeReplyIndex === index && (
                    <div className="reply-container">
                      <input
                        ref={replyRef}
                        placeholder="Reply to Student..."
                        value={reply}
                        onChange={(e) => handleReplyChange(e)}
                      />
                      <button
                        onClick={() =>
                          handleReplySubmit(
                            index,
                            activeQuestionDescription,
                            answer
                          )
                        }
                      >
                        Send
                      </button>
                    </div>
                  )}
                  <br />
                  <button
                    onClick={() => {
                      toggleContactAdminInput(index);
                      setReportInput(!reportInput);
                    }}
                    className="border px-4 py-1 bg-red-500 text-white font-semibold rounded-md m-1"
                  >
                    {contactAdminIndex === index ? "Cancel" : "Report"}
                  </button>
                  {contactAdminIndex === index && (
                    <div className="reply-container">
                      <input
                        ref={reportRef}
                        placeholder="Reason for contact..."
                        value={reason}
                        onChange={(e) => handleContactAdminChange(e)}
                      />
                      <button
                        onClick={() =>
                          handleContactAdminSubmit(
                            index,
                            activeQuestionDescription,
                            answer
                          )
                        }
                      >
                        Send
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeResponseType === "yesNo" && yesNoData.length > 0 && (
          <div className="flex flex-col items-center mt-3">
            <PieChart data={yesNoData} />
          </div>
        )}
        {activeResponseType === "rating" && ratingData.length > 0 && (
          <div className="rating-data">
            <BarChart data={ratingData} labels={["1", "2", "3", "4", "5"]} />
          </div>
        )}
        {activeResponseType === "multiple" && multipleChoiceData.length > 0 && (
          <div className="multiple-choice-data">
            <BarChart data={multipleChoiceData} labels={multipleChoiceLabels} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackViewPage;
