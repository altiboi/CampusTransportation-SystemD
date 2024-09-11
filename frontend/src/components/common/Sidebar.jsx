// components/Sidebar.js
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faClipboardCheck,
  faThLarge,
  faReceipt,
  faSignOutAlt,
  faBus,
  faBell,
  faMessage,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/logo.png";

const Sidebar = ({ activeMenuItem, handleMenuItemClick, role }) => {
  const renderMenuItems = () => {
    if (role === "staff") {
      return (
        <>
          <Link
            to="/home"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Home"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Home")}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </Link>
          <Link
            to="/staffanalytics"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Analytics"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Analytics")}
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Analytics
          </Link>
          <Link
            to="/vehicles"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Vehicles"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Vehicles")}
          >
            <FontAwesomeIcon icon={faBicycle} className="mr-2" />
            Vehicles
          </Link>
          <Link
            to="/notifications"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Create Notification"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Create Notification")}
          >
            <FontAwesomeIcon icon={faMessage} className="mr-2" />
            Create Notification
          </Link>
          <Link
            to="/updatebusschedule"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Update Bus Schedule"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Update Bus Schedule")}
          >
            <FontAwesomeIcon icon={faBus} className="mr-2" />
            Update Bus Schedule
          </Link>
        </>
      );
    } else if (role === "user") {
      return (
        <>
          <Link
            to="/home"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Home"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-gray-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Home")}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </Link>
          <Link
            to="/services"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Services"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-gray-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Services")}
          >
            <FontAwesomeIcon icon={faThLarge} className="mr-2" />
            Services
          </Link>
          <Link
            to="/activity"
            className={`flex items-center justify-start px-4 py-3 ${
              activeMenuItem === "Activity"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-gray-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Activity")}
          >
            <FontAwesomeIcon icon={faReceipt} className="mr-2" />
            Activity
          </Link>
        </>
      );
    }
  };

  return (
    <div className="bg-black text-white w-64 flex flex-col max-w-64 relative hidden pt-10 lg:flex flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="Logo" className="w-36" />
      </div>
      {/* Menu Items */}
      <div className="flex-grow space-y-5 p-4">{renderMenuItems()}</div>
      {/* Logout Button */}
      <div className="mt-auto mb-4 p-4">
        <button
          onClick={() => console.log("Logout clicked")} // Replace with actual logout logic
          className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
