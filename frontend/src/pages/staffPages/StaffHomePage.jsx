import React, { useEffect } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import ProgressCircle from "../../components/ProgressCircle"; // Assuming you're using this component
import PieChart from "../../components/PieChart"; // Assuming you're using this component
import CustomBarChart from "../../components/CustomBarChart"; // Importing the CustomBarChart component
import Card from "../../components/Card"; // Importing the Card component

function StaffHomePage() {
  const { setTitle, setTask } = useAppContext();
  const { currentUser } = useAuth();

  // Example data for charts
  const pieChartData = [
    { name: "Schedule A", value: 10 },
    { name: "Schedule B", value: 20 },
    { name: "Schedule C", value: 30 },
    { name: "Schedule D", value: 40 },
  ];

  const barChartData = [
    { name: "July", scooters: 8, bikes: 5, skateboards: 2 },
    { name: "August", scooters: 7, bikes: 6, skateboards: 1 },
    { name: "September", scooters: 9, bikes: 7, skateboards: 3 },
    // Add more months as needed
  ];

  useEffect(() => {
    setTitle("Home");
    setTask(0);
  }, [setTitle, setTask]);

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
            to="/analytics"
            className="bg-black text-white p-4 rounded shadow-md hover:bg-gray-800"
          >
            View Analytics
          </Link>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Total Vehicles</h2>
            <p className="text-xl">95</p> {/* Example data */}
          </div>
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Pending Notifications</h2>
            <p className="text-xl">3</p> {/* Example data */}
          </div>
          <div className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <ul>
              <li>New vehicle added</li>
              <li>Notification sent</li>
              {/* Example data */}
            </ul>
          </div>
        </div>

        {/* Number of Bus Schedules */}
        <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
          <h2 className="text-lg font-semibold">Number of Bus Schedules</h2>
          <p className="text-xl">Total: 80</p> {/* Example data */}
        </div>

        {/* Vehicle Utilization */}
        <Card className="w-full p-4 mb-6">
          <div className="text-sm w-full font-semibold mb-4 text-center">
            Vehicle Utilization
          </div>
          <div className="w-full h-64">
            <CustomBarChart data={barChartData} />
          </div>
        </Card>

        {/* Profile Summary */}
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Profile Summary</h2>
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Role:</strong> {currentUser.role}
          </p>
          {/* Additional profile information */}
        </div>
      </div>
    </div>
  );
}

export default StaffHomePage;
