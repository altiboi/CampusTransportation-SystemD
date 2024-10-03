import React, { useEffect, useState } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import PieChart from "../../components/PieChart";
import CustomBarChart from "../../components/CustomBarChart";
import Card from "../../components/Card";
import ProgressCircle from "../../components/ProgressCircle";
import { useAppContext } from "../../contexts/AppContext";
import scooter from "../../assets/scooter.svg";
import skateboard from "../../assets/skateBoard.svg";
import bike from "../../assets/bike.svg";
import { getAllVehicles, getAllRentals } from "../../api/functions";
//import { getWeekOfYear } from 'date-fns';

function StaffAnalyticsPage({ vehicles }) {
  const { setTitle, setTask } = useAppContext();
  const [vehicleData, setVehicleData] = useState({
    scooter: { total: 0, used: 0 },
    bike: { total: 0, used: 0 },
    skateboard: { total: 0, used: 0 },
  });
  const [allRentals, setAllRentals] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("months");
  
  useEffect(() => {
    setTitle("Analytics");
    setTask(0);

    // Fetch vehicles and rentals when component mounts
    fetchVehiclesAndRentals();
  }, [setTitle, setTask]);

  const fetchVehiclesAndRentals = async () => {
    try {
      // Fetch all vehicles
      //const vehicles = await getAllVehicles();
  
      // Count vehicles based on type and availability
      const vehicleCounts = vehicles.reduce(
        (acc, vehicle) => {
          const type = vehicle.type?.toLowerCase(); // Handle possible undefined vehicle.type
  
          // Ensure the type exists in the accumulator
          if (!acc[type]) {
            acc[type] = { total: 0, used: 0 };
          }
  
          acc[type].total += 1;
          if (vehicle.currentRentalID) {
            acc[type].used += 1;
          }
          return acc;
        },
        {
          scooter: { total: 0, used: 0 },
          bike: { total: 0, used: 0 },
          skateboard: { total: 0, used: 0 },
        }
      );
      setVehicleData(vehicleCounts);
  
      // Fetch all rentals
      const rentals = await getAllRentals();
      setAllRentals(rentals);
      processRentalsByTimeframe(rentals);

      //console.log("fetched from db")
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    processRentalsByTimeframe(allRentals);
  }, [timeframe]);
  
  const processRentalsByTimeframe = (rentals) => {
    const rentalsByTimeframe = rentals.reduce((acc, rental) => {
      let rentedTime;

      // Determine time grouping based on selected timeframe
      switch (timeframe) {
        case "days":
          rentedTime = new Date(rental.rentedAt).toLocaleDateString(); // Group by day
          break;
        case "weeks":
          const date = new Date(rental.rentedAt);
          // Get the first day of the year
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          // Calculate the number of days between the rental date and the first day of the year
          const daysSinceStartOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
          // Calculate the week number (adding 1 to count from 1 instead of 0)
          const week = Math.ceil((daysSinceStartOfYear + firstDayOfYear.getDay() + 1) / 7);
          rentedTime = `${date.getFullYear()}-W${week}`; // Group by week (e.g., 2024-W5)
          break;
        case "months":
        default:
          rentedTime = new Date(rental.rentedAt).toLocaleString("default", { month: "long" }); // Group by month
          break;
      }

      if (!acc[rentedTime]) {
        acc[rentedTime] = { scooter: 0, bike: 0, skateboard: 0 };
      }

      // Make sure that the rental type keys match your vehicles ("scooter", "bike", "skateboard")
      const rentalType = rental.type.toLowerCase();
      if (acc[rentedTime][rentalType] !== undefined) {
        acc[rentedTime][rentalType] += 1;
      }
      
      return acc;
      }, {});

    // Format bar chart data
    const chartData = Object.keys(rentalsByTimeframe).map((time) => ({
      name: time,
      scooters: rentalsByTimeframe[time].scooter,
      bikes: rentalsByTimeframe[time].bike,
      skateboards: rentalsByTimeframe[time].skateboard,
    }));
    setBarChartData(chartData);
  };

  const calculatePercentage = (used, total) =>
    total === 0 ? 0 : ((used / total) * 100).toFixed(2);

  const pieChartData = [
    { name: "Scooters", value: vehicleData.scooter.used },
    { name: "Bikes", value: vehicleData.bike.used },
    { name: "Skateboards", value: vehicleData.skateboard.used },
  ];

  // Mapping images to vehicle types
  const vehicleImages = {
    scooter: scooter,
    bike: bike,
    skateboard: skateboard,
  };

  //console.log(vehicleData);
  //console.log(barChartData);

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
                  <img
                    src={vehicleImages[vehicle]}
                    alt={`${vehicle} icon`}
                    className="w-16 h-16 mb-2"
                  />
                  <ProgressCircle percentage={percentage} size={120} />
                  <div className="mt-2">
                    {data.used}/{data.total}{" "}
                    Currently In Use
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

          {/* Bar chart for rentals */}
          <Card className="w-full p-4">
            <div className="text-sm w-full font-semibold mb-4 text-center">
              Rentals by {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </div>
            {/* Dropdown or buttons to select timeframe */}
            <div className="flex justify-center mb-4">
              <button
                className={`mx-2 p-2 ${timeframe === "days" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setTimeframe("days")}
              >
                Days
              </button>
              <button
                className={`mx-2 p-2 ${timeframe === "weeks" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setTimeframe("weeks")}
              >
                Weeks
              </button>
              <button
                className={`mx-2 p-2 ${timeframe === "months" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setTimeframe("months")}
              >
                Months
              </button>
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