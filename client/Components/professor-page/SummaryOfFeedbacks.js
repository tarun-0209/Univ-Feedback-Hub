import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chart } from "chart.js/auto";
import Header from "../student-page/Header";
import SideBar from "../student-page/SideBar";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

const SummaryOfFeedbacks = () => {
  const { userId, feedbackFormName } = useParams();
  const [processedFeedback, setProcessedFeedback] = useState(null);
  const [metricsData, setMetricsData] = useState([]);
  const [departmentAverages, setDepartmentAverages] = useState(null);
  const [peerRankings, setPeerRankings] = useState([]);
  const [currentTotalScore, setCurrentTotalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.BASE_URL;
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const professorName = userData?.name;
  const chartRef = useRef(null);
  const [showInsights, setShowInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedProfessor = encodeURIComponent(professorName);
        const encodedFormName = encodeURIComponent(feedbackFormName);

        const [feedbackRes, deptRes, peerRes] = await Promise.all([
          fetch(
            `${BASE_URL}/api/v1/getProcessedFeedbacks/${encodedProfessor}/${encodedFormName}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          ),
          fetch(
            `${BASE_URL}/api/v1/department-averages/${userData.Department}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          ),
          fetch(`${BASE_URL}/api/v1/peer-rankings/${userData.Department}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        ]);

        if (!feedbackRes.ok || !deptRes.ok || !peerRes.ok) {
          throw new Error("Failed to fetch some data");
        }

        const [feedbackData, deptData, peerData] = await Promise.all([
          feedbackRes.json(),
          deptRes.json(),
          peerRes.json(),
        ]);

        setProcessedFeedback(feedbackData.latest);
        setMetricsData(feedbackData.metrics);
        setDepartmentAverages(deptData);
        setPeerRankings(peerData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [feedbackFormName, professorName, userData.Department]);

  useEffect(() => {
    if (metricsData.length > 0) {
      const latestMetrics = metricsData[metricsData.length - 1];
      const calculatedScore =
        latestMetrics.clarity +
        latestMetrics.doubtResolution +
        latestMetrics.practicalKnowledge +
        latestMetrics.overallRating;
      setCurrentTotalScore(calculatedScore);
    }
  }, [metricsData]);

  useEffect(() => {
    if (!chartRef.current || metricsData.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    let chartInstance = null;

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: metricsData.map((m) => new Date(m.date).toLocaleDateString()),
        datasets: [
          {
            label: "Clarity",
            data: metricsData.map((m) => m.clarity),
            borderColor: "#10b981",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Doubt Resolution",
            data: metricsData.map((m) => m.doubtResolution),
            borderColor: "#3b82f6",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Practical Knowledge",
            data: metricsData.map((m) => m.practicalKnowledge),
            borderColor: "#f59e0b",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Overall Rating",
            data: metricsData.map((m) => m.overallRating),
            borderColor: "#6366f1",
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 0.5,
              color: "#6b7280",
            },
            grid: {
              color: "#e5e7eb",
            },
          },
          x: {
            ticks: {
              color: "#6b7280",
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#374151",
            },
          },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#111827",
            bodyColor: "#374151",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            boxPadding: 8,
          },
        },
      },
    });

    chartRef.current.chart = chartInstance;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [metricsData]);

  const ComparisonCard = ({ title, current, average }) => {
    const difference = current - (average || 0);
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-semibold text-gray-800">
              {current?.toFixed(1) || "N/A"}
            </span>
            <span className="text-xs text-gray-500 ml-2">(Your Score)</span>
          </div>
          <div className="text-right">
            <div
              className={`flex items-center gap-1 ${
                difference >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              <svg
                className={`w-4 h-4 ${difference >= 0 ? "" : "rotate-180"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                {Math.abs(difference)?.toFixed(1) || "0.0"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dept. Avg: {average?.toFixed(1) || "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const PeerCard = ({ peer, index, isCurrent }) => (
    <div
      className={`p-4 rounded-lg ${
        isCurrent ? "bg-indigo-50 border-2 border-indigo-300" : "bg-white"
      } shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 font-medium">{index + 1}.</span>
            <div>
              <h4
                className={`font-medium ${
                  isCurrent ? "text-indigo-700" : "text-gray-800"
                }`}
              >
                {peer.professor}
                {isCurrent && (
                  <span className="ml-2 text-indigo-600 text-sm">(You)</span>
                )}
              </h4>
              <p className="text-sm text-gray-500">
                {" "}
                Subject & Section :{peer.feedbackForm}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span
              className={`text-lg font-semibold ${
                isCurrent ? "text-indigo-700" : "text-gray-700"
              }`}
            >
              {peer.totalScore?.toFixed(1) || "N/A"}
            </span>
            <p className="text-xs text-gray-500">/20</p>
          </div>
          {index < 3 && (
            <span className="text-xl">{["🥇", "🥈", "🥉"][index]}</span>
          )}
        </div>
      </div>
    </div>
  );

  const isInTopRankings = peerRankings.some(
    (p) => p.professor === professorName && p.feedbackForm === feedbackFormName
  );

  // Updated handleGetInsights function
  const handleGetInsights = async () => {
    try {
      if (!processedFeedback?.weaknesses?.length) {
        setError("No weaknesses found to generate insights");
        return;
      }

      setInsightsLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/generate-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          department: userData?.Department || "General",
          weaknesses: processedFeedback.weaknesses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate insights");
      }

      const data = await response.json();
      setAiInsights(data.insights);
      setShowInsights(true);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to generate insights. Please try again.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const InsightsModal = ({ insights, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Actionable Insights
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="prose prose-sm md:prose-base max-w-none">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(insights || "No insights generated"),
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 md:p-3 p-0">
        <SideBar />
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] overflow-y-auto rounded-lg w-full md:w-5/6 px-2 md:px-5 py-2">
          {/* Header Section */}
          <div className="px-3 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-emerald-500 text-white shadow-md">
            <div>
              <h1 className="text-xl md:text-3xl font-semibold tracking-tight truncate">
                Feedback Analysis: {feedbackFormName}
              </h1>
              <p className="text-sm mt-1 opacity-90">
                Professor: {professorName}
              </p>
            </div>
            <Link
              to={`/user/${userId}`}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 md:px-4 py-1 md:py-2 rounded-lg transition-all duration-200 ease-in-out group shadow-sm hover:shadow-md w-full md:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 text-black group-hover:scale-110 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs md:text-sm font-black text-black">
                Back to Profile
              </span>
            </Link>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">Error: {error}</div>
          ) : (
            <div className="px-2 md:px-3 py-4 md:py-6 bg-white">
              {processedFeedback && (
                <div className="space-y-6">
                  {/* Metrics Chart */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Performance Trends Over Time
                    </h3>
                    <div className="h-96">
                      <canvas ref={chartRef} />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Data collected from {metricsData.length} feedback sessions
                    </p>
                  </div>

                  {/* Department Comparison */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Department Comparison
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <ComparisonCard
                        title="Clarity"
                        current={metricsData[metricsData.length - 1]?.clarity}
                        average={departmentAverages?.clarity}
                      />
                      <ComparisonCard
                        title="Doubt Resolution"
                        current={
                          metricsData[metricsData.length - 1]?.doubtResolution
                        }
                        average={departmentAverages?.doubtResolution}
                      />
                      <ComparisonCard
                        title="Practical Knowledge"
                        current={
                          metricsData[metricsData.length - 1]
                            ?.practicalKnowledge
                        }
                        average={departmentAverages?.practicalKnowledge}
                      />
                      <ComparisonCard
                        title="Overall Rating"
                        current={
                          metricsData[metricsData.length - 1]?.overallRating
                        }
                        average={departmentAverages?.overallRating}
                      />
                    </div>
                    {departmentAverages?.count && (
                      <p className="text-xs text-gray-500 mt-3">
                        Compared to {departmentAverages.count} professors in{" "}
                        {userData.Department}
                      </p>
                    )}
                  </div>

                  {/* Peer Benchmarking */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      Peer Benchmarking (Max Score - 20)
                    </h3>
                    <div className="space-y-3">
                      {peerRankings.map((peer, index) => (
                        <PeerCard
                          key={peer.feedbackForm}
                          peer={peer}
                          index={index}
                          isCurrent={
                            peer.professor === professorName &&
                            peer.feedbackForm === feedbackFormName
                          }
                        />
                      ))}
                    </div>

                    {!isInTopRankings && currentTotalScore && (
                      <div className="mt-4 bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 font-medium">
                              ---
                            </span>
                            <div>
                              <h4 className="font-medium text-indigo-700">
                                {professorName}
                                <span className="ml-2 text-indigo-600 text-sm">
                                  (You)
                                </span>
                              </h4>
                              <p className="text-sm text-gray-500">
                                Subject & Section :{feedbackFormName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-lg font-semibold text-indigo-700">
                                {currentTotalScore.toFixed(1)}
                              </span>
                              <p className="text-xs text-gray-500">/20</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isInTopRankings && !currentTotalScore && (
                      <div className="mt-4 bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-600">
                          No comparison data available for your course
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Strengths Section */}
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                      Recent Strengths
                    </h3>
                    <ul className="space-y-2">
                      {processedFeedback.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Section */}
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-rose-800">
                        Recent Areas for Improvement
                      </h3>
                      <button
                        onClick={handleGetInsights}
                        disabled={insightsLoading}
                        className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200 px-3 py-1 rounded-md text-rose-800 text-sm transition-colors"
                      >
                        {insightsLoading ? (
                          <span className="animate-spin">⚙</span>
                        ) : (
                          <span>✨ Get Actionable Insights</span>
                        )}
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {processedFeedback.weaknesses.map((weakness, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div className="w-2 h-2 bg-rose-500 rounded-full mt-2" />
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>

                    {showInsights && (
                      <InsightsModal
                        insights={aiInsights}
                        onClose={() => setShowInsights(false)}
                      />
                    )}
                  </div>

                  {/* Last Updated */}
                  <div className="text-sm text-gray-500 text-center">
                    Last updated:{" "}
                    {new Date(
                      processedFeedback.processedAt
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryOfFeedbacks;
