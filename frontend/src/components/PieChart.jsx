// components/PieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ className }) => {
  const data = {
    labels: ["Bikes", "Skateboards", "Others"],
    datasets: [
      {
        data: [30, 20, 50],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={className}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
