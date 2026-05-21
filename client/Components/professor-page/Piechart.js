import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart instance with fixed size
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Yes", "No"],
        datasets: [
          {
            label: "Responses",
            data: data,
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Prevent Chart.js from overriding height
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className=" h-96">
      <canvas ref={chartRef} className="" />
    </div>
  );
};

export default PieChart;
