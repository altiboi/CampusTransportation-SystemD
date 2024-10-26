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

function CustomBarChart({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFines, setSelectedFines] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [fineType, setFineType] = useState("");

  const handleBarClick = async (entry, dataKey) => {
    const vehicle = entry.name;

    const isPaid = dataKey === "paidFines";

    // Fetch fines data for the selected vehicle
    // const fines = await getFinesForVehicle(vehicle);

    const fines = {
      "9ZHlT5ScrPIzoxSerMOQ": [
        {
          amount: 50,
          issuedAt: "Thu, 03 Oct 2024 13:18:55 GMT",
          paid: true,
          rentalID: "XOMkrTClECDmbtHafxRm",
          userID: "nB0yuSKAXhceZifZWpqhRjnpJxs1",
          vehicleID: "9ZHlT5ScrPIzoxSerMOQ",
        },
        {
          amount: 75,
          issuedAt: "Fri, 04 Oct 2024 10:30:00 GMT",
          paid: false,
          rentalID: "ABCdefGHIjklMNOpqrST",
          userID: "nB0yuSKAXhceZifZWpqhRjnpJxs1",
          vehicleID: "9ZHlT5ScrPIzoxSerMOQ",
        },
      ],
      "1ABCdefGHIjklMNOpqrS": [
        {
          amount: 100,
          issuedAt: "Wed, 02 Oct 2024 09:45:30 GMT",
          paid: true,
          rentalID: "UVWxyzABCdefGHIjklM",
          userID: "mC1zvTLBYidgZjgAXqrnSknqKyt2",
          vehicleID: "1ABCdefGHIjklMNOpqrS",
        },
        {
          amount: 60,
          issuedAt: "Sat, 05 Oct 2024 14:20:15 GMT",
          paid: false,
          rentalID: "NOPqrsTUVwxyzABCdef",
          userID: "mC1zvTLBYidgZjgAXqrnSknqKyt2",
          vehicleID: "1ABCdefGHIjklMNOpqrS",
        },
      ],
      // Add more vehicles as needed
    };

    // Get the fines for the selected vehicle
    const vehicleFines = fines[vehicle] || [];

    // Filter fines based on paid status
    const filteredFines = vehicleFines.filter((fine) => fine.paid === isPaid);

    console.log("Filtered fines:", filteredFines); // Add this line for debugging

    setSelectedFines(filteredFines);
    setSelectedVehicle(vehicle);
    setFineType(isPaid ? "Paid" : "Unpaid");
    setModalOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
