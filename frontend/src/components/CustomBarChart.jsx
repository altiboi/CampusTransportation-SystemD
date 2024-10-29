// components/BarChart.js
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import FinesModal from "./FinesModal"; // We'll create this component next

// Assuming you have a function to fetch fines data
// import { getFinesForVehicle } from "../services/finesService";

function CustomBarChart({ chartData, fines }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFines, setSelectedFines] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [fineType, setFineType] = useState("");

  const handleBarClick = async (entry, dataKey) => {
    const vehicle = entry.name == "Scooters" ? "scooter" : entry.name == "Skateboards" ? "skateboard" : entry.name == "Bikes" ? "bike" : "none";
    console.log("Selected vehicle:", entry.name); // Debugging line

    const isPaid = dataKey === "paidFines";

    // Filter fines based on the selected vehicle
    const vehicleFines = fines.filter((fine) => fine.vehicleType === vehicle);

    console.log("Vehicle fines:", vehicleFines); // Debugging line

    // Filter fines based on paid status
    const filteredFines = vehicleFines.filter((fine) => fine.paid === isPaid);

    console.log("Filtered fines:", filteredFines); // Debugging line

    setSelectedFines(filteredFines);
    setSelectedVehicle(entry.name);
    setFineType(isPaid ? "Paid" : "Unpaid");
    setModalOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid horizontal={true} vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#000000"
            axisLine={false}
            tickLine={false}
            tick={{ fontWeight: "bold" }}
          />
          <YAxis
            stroke="#000000"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontWeight: "bold" }}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="paidFines"
            name="Paid Fines"
            fill="#848484"
            onClick={(entry) => handleBarClick(entry, "paidFines")}
          />
          <Bar
            dataKey="unpaidFines"
            name="Unpaid Fines"
            fill="#222222"
            onClick={(entry) => handleBarClick(entry, "unpaidFines")}
          />
        </BarChart>
      </ResponsiveContainer>
      <FinesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fines={selectedFines}
        vehicle={selectedVehicle}
        fineType={fineType}
      />
    </>
  );
}

export default CustomBarChart;
