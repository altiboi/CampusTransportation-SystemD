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
  faMessage,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate to redirect after logout
import { doSignOut } from "../../firebase/auth";

const Sidebar = ({ activeMenuItem, handleMenuItemClick, role }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/login"); // Redirect to the login page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderMenuItems = () => {
    if (role === "staff") {
      return (
        <>
          <Link
            to="/home"
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
              activeMenuItem === "Home"
                ? "rounded-lg bg-white text-black font-bold text-sm "
                : "text-white-700 font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Home")}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </Link>
          <Link
            to="/staffanalytics"
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
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
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
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
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
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
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
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
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
              activeMenuItem === "Home"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Home")}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </Link>
          
          <Link
            to="/userService"
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
              activeMenuItem === "Services"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white font-bold text-sm"
            }`}
            onClick={() => handleMenuItemClick("Services")}
          >
            <FontAwesomeIcon icon={faThLarge} className="mr-2" />
            Services
          </Link>
          
          <Link
            to="/userActivity"
            className={`flex items-center justify-start px-4 py-3 transition transform hover:scale-105 ${
              activeMenuItem === "Activity"
                ? "bg-white text-black font-bold text-sm rounded-lg"
                : "text-white font-bold text-sm"
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
          onClick={handleLogout} // Call handleLogout on click
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
