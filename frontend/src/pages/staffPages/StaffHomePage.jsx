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
import hello from "../../assets/hello.svg";
import { fetchBusRoutes } from "../../api/functions";
import { FaBus, FaWarehouse, FaBiking } from "react-icons/fa"; // Import icons
import NotificationCard from "../../components/common/NotificationCard";
import { fetchUserNotifications } from "../../api/functions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Add this import
import NotificationCardSkeleton from "../../components/common/NotificationCardSkeleton";

function StaffHomePage({ currentUser, vehicles }) {
  const { setTitle, setTask } = useAppContext();
  const [vehicleData, setVehicleData] = useState({
    scooter: { total: 0, used: 0 },
    bike: { total: 0, used: 0 },
    skateboard: { total: 0, used: 0 },
  });
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  useEffect(() => {
    setTitle("Home");
    setTask(0);
    getActiveRoutes();
    fetchRecentNotifications();
  }, [setTitle, setTask]);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      setIsLoadingVehicles(true);
      setCircleData();
    }
  }, [vehicles]);

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
    setIsLoadingVehicles(false);
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
    const dayType =
      currentDay === 0 || currentDay === 6 ? "weekend" : "weekday"; // 0 is Sunday, 6 is Saturday

    // Helper to convert "HH:MM" time string to total minutes
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const activeRoutes = [];

    routes.forEach((route) => {
      // Check if route matches current day type (weekday/weekend)
      if (route.day_type === dayType) {
        route.routes.forEach((subRoute) => {
          subRoute.schedule.forEach((schedule) => {
            // Handle specific day checks (e.g., Saturday, Sunday)
            if (
              !schedule.day ||
              (schedule.day && matchesCurrentDay(schedule.day, currentDay))
            ) {
              const startTime = convertTimeToMinutes(schedule.start_time);
              const endTime = convertTimeToMinutes(schedule.end_time);

              // Check if current time falls within the schedule time range
              if (currentTime >= startTime && currentTime <= endTime) {
                activeRoutes.push({
                  route_number: route.route_number,
                  route_name: route.route_name,
                });
              }
            }
          });
        });
      }
    });

    setActiveRoutes(activeRoutes);
  };

  const matchesCurrentDay = (day, currentDay) => {
    const dayMapping = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayMapping[day] === currentDay;
  };

  const fetchRecentNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const allNotifications = await fetchUserNotifications(currentUser.uid);
      console.log(allNotifications);
      const recent = allNotifications.receivedNotifications.slice(0, 3);
      setRecentNotifications(recent);
    } catch (error) {
      console.error("Failed to fetch recent notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto p-4 pt-20">
        {/* Greeting Card */}
        <Card className="flex flex-row items-center justify-between text-black !bg-gray-100 p-6 mb-6 rounded shadow-md">
          <div className="relative">
            <h2 className="text-3xl font-semibold">
              Hello, {currentUser.name}!
            </h2>
            <p className="text-lg mt-2">It's great to see you again</p>
          </div>
          <div>
            <img src={hello} alt="Hello" className="w-32 h-32 text-white" />
          </div>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="flex flex-col items-center bg-gray-100 p-4 transition-colors duration-300 hover:bg-black hover:text-white group">
            <FaBiking className="text-4xl mb-2 text-black group-hover:text-white" />
            <p className="text-2xl font-bold">{vehicles.length}</p>
            <h2 className="text-lg text-center">Total Vehicles</h2>
          </Card>
          <Card className="flex flex-col items-center  bg-gray-100 p-4 transition-colors duration-300 hover:bg-black hover:text-white group">
            <FaWarehouse className="text-4xl mb-2 text-black group-hover:text-white" />
            <p className="text-2xl font-bold">7</p>
            <h2 className="text-lg text-center">Total Rental Stations</h2>
          </Card>
          <Card className="flex flex-col items-center p-4  bg-gray-100 transition-colors duration-300 hover:bg-black hover:text-white group">
            <FaBus className="text-4xl mb-2 text-black group-hover:text-white" />
            <p className="text-2xl font-bold">{activeRoutes.length}</p>
            <h2 className="text-lg text-center">Current Active Bus Routes</h2>
          </Card>
        </div>

        {/* Recent Notifications Card */}

        {/* Vehicle Utilization */}
        <div className="flex flex-wrap gap-4 pb-20 justify-center pt-4">
          {isLoadingVehicles ? (
            // Loading skeletons for vehicle cards
            <>
              <Card className="flex-grow max-w-xs ">
                <Skeleton height={350} />
              </Card>
              <Card className="flex-grow max-w-xs">
                <Skeleton height={350} />
              </Card>
              <Card className="flex-grow max-w-xs ">
                <Skeleton height={350} />
              </Card>
            </>
          ) : (
            // Render actual vehicle data when loaded
            Object.keys(vehicleData).map((vehicle) => {
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
                      {data.used}/{data.total} Currently In Use
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Card className="mb-12 bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          {isLoadingNotifications ? (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          ) : recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationCard
                  notification={notification}
                  currentUser={currentUser}
                  onClick={() => {}} // You can add a function to handle click if needed
                />
                <br />
              </React.Fragment>
            ))
          ) : (
            <p>No recent notifications</p>
          )}
          <Link
            to="/notifications"
            className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-300"
          >
            View all notifications
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default StaffHomePage;