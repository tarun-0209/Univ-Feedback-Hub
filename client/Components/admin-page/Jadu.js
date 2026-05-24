import React, { useState } from "react";
const BASE_URL = process.env.BASE_URL;

const Jadu = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [results, setResults] = useState(null); // Results state
  const [message, setMessage] = useState(""); // Backend message state

  const handleFeedbackProcessing = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/v1/processFeedbacks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) {
        throw new Error("Manual trigger for feedback processing failed.");
      }

      // Parse the response as JSON
      const data = await response.json();

      // Update results and message state
      setMessage(data.message || "Processing completed.");
      setResults(data.results || []);
    } catch (error) {
      console.error("Error in manual feedback processing:", error);
      setError(
        "Failed to manually process feedbacks. Please try again later or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center justify-center py-4 h-[calc(100vh-35vh)] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">Manual Feedback Processing</h2>
      <p className="text-sm text-gray-600 mb-4">
        This feature serves as a fallback to manually trigger feedback
        processing in case the scheduled job encounters issues.
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2">
        <button
          type="button"
          onClick={handleFeedbackProcessing}
          disabled={loading} // Disable button during processing
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700`}
        >
          {loading ? "Processing..." : "Trigger Feedback Processing"}
        </button>
      </div>

      {loading && (
        <div className="text-gray-600 text-lg font-medium py-2">
          Triggering manual processing...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-lg font-medium py-2">{error}</div>
      )}

      {message && (
        <div className="text-green-500 text-lg font-medium py-2">{message}</div>
      )}

      {results && results.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold text-center mb-4">
            Processing Results
          </h2>
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg shadow-md p-4 mb-4 ${
                result.success ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <h3 className="text-lg font-semibold">
                Feedback Form: {result.feedbackForm}
              </h3>
              {result.success ? (
                <p className="text-green-700 font-medium">
                  Successfully processed.
                </p>
              ) : (
                <div>
                  <p className="text-red-700 font-medium">Failed to process.</p>
                  <p className="text-gray-500 text-sm">Error: {result.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jadu;
