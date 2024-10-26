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
  faChevronRight,
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
    const baseClasses =
      "flex items-center justify-between px-4 py-3 transition transform hover:scale-105 rounded-xl font-bold text-sm";

    const renderMenuItem = (to, name, icon) => (
      <Link
        to={to}
        className={`${baseClasses} ${
          activeMenuItem === name ? "bg-white text-black" : "text-white"
        }`}
        onClick={() => handleMenuItemClick(name)}
      >
        <div className="flex items-center">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          {name}
        </div>
        {activeMenuItem === name && (
          <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
        )}
      </Link>
    );

    if (role === "staff") {
      return (
        <>
          {renderMenuItem("/home", "Home", faHome)}
          {renderMenuItem("/staffanalytics", "Analytics", faChartLine)}
          {renderMenuItem("/vehicles", "Vehicles", faBicycle)}
          {renderMenuItem("/notifications", "Create Notification", faMessage)}
          {renderMenuItem("/updatebusschedule", "Update Bus Schedule", faBus)}
        </>
      );
    } else if (role === "user") {
      return (
        <>
          {renderMenuItem("/home", "Home", faHome)}
          {renderMenuItem("/userService", "Services", faThLarge)}
          {renderMenuItem("/userActivity", "Activity", faReceipt)}
        </>
      );
    }
  };

  return (
    <div className="bg-black text-white w-72 flex flex-col max-w-72 relative hidden pt-10 lg:flex flex-shrink-0">
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
