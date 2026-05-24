import React, { useState } from "react";
const BASE_URL = process.env.BASE_URL;

const CreateFeedbackForm = () => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    type: "",
    options: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startTime, setStartTime] = useState("");
  const [professorUsername, setUsername] = useState("");
  const handleusernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value);
  };
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newOptions = newQuestion.options;

    if (name === "type") {
      if (value === "yesNo") {
        newOptions = ["Yes", "No"];
      } else if (value === "rating") {
        newOptions = ["1", "2", "3", "4", "5"];
      } else {
        newOptions = [];
      }
    }

    setNewQuestion({ ...newQuestion, [name]: value, options: newOptions });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.description || !newQuestion.type) {
      setError("Please provide question description and type");
      return;
    }

    if (newQuestion.type === "multiple" && newQuestion.options.length === 0) {
      setError(
        "Please provide at least one option for multiple choice question"
      );
      return;
    }

    const newQuestionWithId = { ...newQuestion, id: Math.random() };
    setQuestions([...questions, newQuestionWithId]);
    setNewQuestion({ description: "", type: "", options: [] });
    setOpenModal(false);
    setError("");
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleMoveUp = (id) => {
    const questionIndex = questions.findIndex((q) => q.id === id);
    if (questionIndex > 0) {
      const questionsCopy = [...questions];
      const [questionToMove] = questionsCopy.splice(questionIndex, 1);
      questionsCopy.splice(questionIndex - 1, 0, questionToMove);
      setQuestions(questionsCopy);
    }
  };

  const handleMoveDown = (id) => {
    const questionIndex = questions.findIndex((q) => q.id === id);
    if (questionIndex < questions.length - 1) {
      const questionsCopy = [...questions];
      const [questionToMove] = questionsCopy.splice(questionIndex, 1);
      questionsCopy.splice(questionIndex + 1, 0, questionToMove);
      setQuestions(questionsCopy);
    }
  };

  const renderOptions = () => {
    switch (newQuestion.type) {
      case "text":
        return null;
      case "yesNo":
        return (
          <>
            <input
              type="text"
              className="border rounded px-2 py-1 mr-2"
              value={newQuestion.options[0] || ""}
              onChange={(e) => handleOptionChange(0, e.target.value)}
              placeholder="Yes"
            />
            <input
              type="text"
              className="border rounded px-2 py-1"
              value={newQuestion.options[1] || ""}
              onChange={(e) => handleOptionChange(1, e.target.value)}
              placeholder="No"
            />
          </>
        );
      case "rating":
        return (
          <>
            {[1, 2, 3, 4, 5].map((option, index) => (
              <input
                key={index}
                type="text"
                className="border rounded px-2 py-1 mr-2"
                value={newQuestion.options[index] || ""}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={option}
              />
            ))}
          </>
        );
      case "multiple":
        return (
          <>
            {[1, 2, 3, 4].map((option, index) => (
              <input
                key={index}
                type="text"
                className="border rounded px-2 py-1 mr-2"
                value={newQuestion.options[index] || ""}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${option}`}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const handleFormSubmit = async () => {
    if (!name.trim()) {
      setError("Please provide a name for the feedback form");
      return;
    }
    if (questions.length === 0) {
      setError("Please add at least one question");
      return;
    }
    console.log("Submitted form data:", questions);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/v1/createFeedbackForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name,
          questions,
          deadline: deadline,
          startTime: startTime,
          professorUsername: professorUsername,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save feedback form");
      }

      const data = await response.json();
      console.log("Feedback form saved successfully:", data);

      // Clearing the form state after successful submission
      setName("");
      setDeadline("");
      setStartTime("");
      setUsername("");
      setNewQuestion({ description: "", type: "", options: [] });
      setOpenModal(false);
      setError("");

      // Displaying success message
      setSuccessMessage(
        "Feedback form created successfully! Please go to the Top 🔝"
      );

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error saving feedback form:", error);
      setError("Failed to save feedback form");
    }
  };
  return (
    <div className="border mt-6 rounded-md bg-indigo-50 p-2.5 h-[calc(100vh-8rem)] overflow-y-auto md:px-10 lg:h-[calc(100vh-35vh)]">
      <div className="flex flex-col">
        <div className=" flex items-center gap-2 my-2">
          <label htmlFor="name" className="text-lg font-semibold">
            Form Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="SUBJECTCODE_SECTION"
            className="border-2 rounded-md px-4 py-2"
          />

          <label htmlFor="name" className="text-lg font-semibold">
            Professor Username:
          </label>
          <input
            type="text"
            id="name"
            value={professorUsername}
            onChange={handleusernameChange}
            placeholder=""
            className="border-2 rounded-md px-4 py-2"
          />
          {questions.length > 0 && (
            <button
              onClick={() => setQuestions([])}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md mt-4 ml-4"
            >
              Reset All Questions
            </button>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label htmlFor="deadline" className="text-lg font-semibold ">
              Close Form On
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={deadline}
              onChange={handleDeadlineChange}
              className="border-2 rounded-md px-4 py-2"
            ></input>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="startTime" className="text-lg font-semibold">
              Open Form On
            </label>
            <input
              type="date"
              id="startTime"
              name="startTime"
              value={startTime}
              onChange={handleStartTimeChange}
              className="border-2 rounded-md px-4 py-2"
            ></input>
          </div>
        </div>
      </div>

      <br />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
      >
        Add Question
      </button>
      <div className={`${openModal ? "block" : "hidden"} mt-4`}>
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
          <label htmlFor="description" className="block font-semibold">
            Question Description:
          </label>
          <input
            type="text"
            name="description"
            value={newQuestion.description}
            onChange={handleInputChange}
            className="border rounded-md px-2 py-1 w-full mt-2"
          />
          <label htmlFor="type" className="block font-semibold mt-4">
            Question Type:
          </label>
          <select
            name="type"
            value={newQuestion.type}
            onChange={handleInputChange}
            className="border rounded-md px-2 py-1 w-full mt-2"
          >
            <option value="">Select Type</option>
            <option value="text">Text</option>
            <option value="yesNo">Yes/No</option>
            <option value="rating">Rating</option>
            <option value="multiple">Multiple Choice</option>
          </select>
          {renderOptions()}
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
          >
            Create Question
          </button>
        </div>
      </div>
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-gray-200 p-4 rounded-md mt-4 border"
        >
          <h3 className="font-semibold">{question.description}</h3>
          <ul className="mt-2">
            {question.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>

          <button
            onClick={() => handleDeleteQuestion(question.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md mr-2 mt-4"
          >
            Delete
          </button>
          <button
            onClick={() => handleMoveUp(question.id)}
            disabled={question.id === questions[0].id}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md mr-2 mt-4"
          >
            Move Up
          </button>
          <button
            onClick={() => handleMoveDown(question.id)}
            disabled={question.id === questions[questions.length - 1].id}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md mt-4"
          >
            Move Down
          </button>
        </div>
      ))}

      <br />
      <br />
      <div>
        <button
          onClick={handleFormSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4"
        >
          Create Feedback Form
        </button>
        {successMessage && (
          <div className="bg-green-200 text-green-800 py-2 px-4 mb-4 rounded">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFeedbackForm;
