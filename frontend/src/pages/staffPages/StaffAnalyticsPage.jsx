import React, { useEffect, useState } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import PieChart from "../../components/PieChart";
import CustomBarChart from "../../components/CustomBarChart";
import Card from "../../components/Card";
import ProgressCircle from "../../components/ProgressCircle"; // Importing the new component
import { useAppContext } from "../../contexts/AppContext";
import scooter from "../../assets/scooter.svg";
import skateboard from "../../assets/skateBoard.svg";
import bike from "../../assets/bike.svg";

function StaffAnalyticsPage() {
  const { setTitle, setTask } = useAppContext();
  const [vehicleData, setVehicleData] = useState({
    scooters: { total: 35, used: 30 },
    bikes: { total: 50, used: 40 },
    skateboards: { total: 10, used: 5 },
  });

  useEffect(() => {
    setTitle("Analytics");
    setTask(0);
  }, [setTitle, setTask]);

  const calculatePercentage = (used, total) =>
    ((used / total) * 100).toFixed(2);

  const pieChartData = [
    { name: "Scooters", value: vehicleData.scooters.used },
    { name: "Bikes", value: vehicleData.bikes.used },
    { name: "Skateboards", value: vehicleData.skateboards.used },
  ];

  const barChartData = [
    { name: "July", scooters: 8, bikes: 5, skateboards: 2 },
    { name: "August", scooters: 7, bikes: 6, skateboards: 1 },
    { name: "September", scooters: 9, bikes: 7, skateboards: 3 },
    // Add more months as needed
  ];

  // Mapping images to vehicle types
  const vehicleImages = {
    scooters: scooter,
    bikes: bike,
    skateboards: skateboard,
  };

  return (
    <div className="flex flex-col h-screen">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto p-4 pt-16">
        <div className="flex flex-wrap gap-4 pb-20 justify-center pt-4">
          {/* Card for each vehicle type */}
          {Object.keys(vehicleData).map((vehicle) => {
            const data = vehicleData[vehicle];
            const percentage = calculatePercentage(data.used, data.total);
            return (
              <Card key={vehicle} className="flex-grow max-w-xs p-4">
                <div className="text-lg font-semibold mb-2 text-center">
                  {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} Usage
                </div>
                <div className="flex flex-col items-center">
                  {/* Add image */}
                  <img
                    src={vehicleImages[vehicle]}
                    alt={`${vehicle} icon`}
                    className="w-16 h-16 mb-2"
                  />
                  <ProgressCircle percentage={percentage} size={120} />
                  <div className="mt-2">
                    {data.used}/{data.total}{" "}
                    {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} Used
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pie chart for vehicle usage */}
          <Card className="flex-grow max-w-sm p-4">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage Breakdown
            </div>
            <PieChart data={pieChartData} />
          </Card>

          {/* Bar chart for monthly rentals */}
          <Card className="w-full p-4">
            <div className="text-sm w-full font-semibold mb-4 text-center">
              Monthly Rentals
            </div>
            <div className="w-full h-64">
              <CustomBarChart data={barChartData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StaffAnalyticsPage;
