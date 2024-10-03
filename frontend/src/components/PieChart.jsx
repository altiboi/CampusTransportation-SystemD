import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ data: pieData, className }) => {
  // Set default data and labels if no data is provided
  const defaultData = {
    labels: ["Scooters", "Bikes", "Skateboards"],
    datasets: [
      {
        data: [0, 0, 0], // Default empty values
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const chartData = pieData
    ? {
        labels: pieData.map((entry) => entry.name), // Extracting names (Scooters, Bikes, etc.)
        datasets: [
          {
            data: pieData.map((entry) => entry.value), // Extracting values (used count)
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            borderWidth: 1,
          },
        ],
      }
    : defaultData;

  return (
    <div className={className}>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;