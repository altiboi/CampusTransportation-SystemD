import React, { useEffect, useState } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import ProgressCircle from "../../components/ProgressCircle"; // Assuming you're using this component
import PieChart from "../../components/PieChart"; // Assuming you're using this component
import CustomBarChart from "../../components/CustomBarChart"; // Importing the CustomBarChart component
import Card from "../../components/Card"; // Importing the Card component
import scooter from "../../assets/scooter.svg";
import skateboard from "../../assets/skateBoard.svg";
import bike from "../../assets/bike.svg";
import { fetchBusRoutes } from "../../api/functions";

function StaffHomePage( {currentUser, vehicles} ) {
  const { setTitle, setTask } = useAppContext();
  const [vehicleData, setVehicleData] = useState({
    scooter: { total: 0, used: 0 },
    bike: { total: 0, used: 0 },
    skateboard: { total: 0, used: 0 },
  });
  const [activeRoutes, setActiveRoutes] = useState([]);
  //const { currentUser } = useAuth();

  //console.log(vehicles)

  useEffect(() => {
    setTitle("Home");
    setTask(0);
    setCircleData();
    getActiveRoutes();
  }, [setTitle, setTask]);

  const setCircleData = () => {
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
  };

  const calculatePercentage = (used, total) =>
    total === 0 ? 0 : ((used / total) * 100).toFixed(2);

  const vehicleImages = {
    scooter: scooter,
    bike: bike,
    skateboard: skateboard,
  };

  const getActiveRoutes = async () => {
    const routes = await fetchBusRoutes();
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes from midnight
    const dayType = currentDay === 0 || currentDay === 6 ? 'weekend' : 'weekday'; // 0 is Sunday, 6 is Saturday
  
    // Helper to convert "HH:MM" time string to total minutes
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
  
    const activeRoutes = [];
  
    routes.forEach((route) => {
      // Check if route matches current day type (weekday/weekend)
      if (route.day_type === dayType) {
        route.routes.forEach((subRoute) => {
          subRoute.schedule.forEach((schedule) => {
            // Handle specific day checks (e.g., Saturday, Sunday)
            if (!schedule.day || (schedule.day && matchesCurrentDay(schedule.day, currentDay))) {
              const startTime = convertTimeToMinutes(schedule.start_time);
              const endTime = convertTimeToMinutes(schedule.end_time);
  
              // Check if current time falls within the schedule time range
              if (currentTime >= startTime && currentTime <= endTime) {
                activeRoutes.push({
                  route_number: route.route_number,
                  route_name: route.route_name
                });
              }
            }
          });
        });
      }
    });

    //console.log(activeRoutes);
    setActiveRoutes(activeRoutes);
  };
  
  // Helper function to match specific day strings with current day
  const matchesCurrentDay = (day, currentDay) => {
    const dayMapping = {
      "Sunday": 0,
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6
    };
    return dayMapping[day] === currentDay;
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto p-4 pt-20">
        <div className="text-2xl font-semibold mb-6">
          Welcome, {currentUser.name}!
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            to="/notifications"
            className="bg-black text-white p-4 rounded shadow-md hover:bg-gray-800"
          >
            View Notifications
          </Link>
          <Link
            to="/vehicles"
            className="bg-black text-white p-4 rounded shadow-md hover:bg-gray-800"
          >
            Manage Vehicles
          </Link>
          <Link
            to="/staffanalytics"
            className="bg-black text-white p-4 rounded shadow-md hover:bg-gray-800"
          >
            View Analytics
          </Link>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Total Vehicles</h2>
            <p className="text-xl">{vehicles.length}</p> {/* Example data */}
          </div>
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Total Rental Stations</h2>
            <p className="text-xl">7</p> {/* Example data */}
          </div>
          <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Current Active Bus Routes</h2>
          <p className="text-xl">{activeRoutes.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pb-20 justify-center pt-4">
          {/* Vehicle Utilization */}
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
        </div>

        {/* Profile Summary */}
        {/* <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Profile Summary</h2>
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Role:</strong> {currentUser.role}
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default StaffHomePage;