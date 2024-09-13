// components/BottomNav.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faClipboardCheck,
  faThLarge,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";

const BottomNav = ({ handleMenuItemClick, role, className }) => {
  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        setActiveMenuItem("Home");
        break;
      case "/userService":
        setActiveMenuItem("Services");
        break;
      case "/userActivity":
        setActiveMenuItem("Activity");
        break;
      default:
        setActiveMenuItem("Home");
    }
  }, [location.pathname]);
  const [activeMenuItem, setActiveMenuItem] = useState("Home");

  const renderNavItems = () => {
    if (role === "staff") {
      return (
        <>
          <Link
            to="/home"
            onClick={() => handleMenuItemClick("Home")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Home" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/staffanalytics"
            onClick={() => handleMenuItemClick("Analytics")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Analytics" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link
            to="/stafftasks"
            onClick={() => handleMenuItemClick("Tasks")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Tasks" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faClipboardCheck} />
            <span className="text-xs">Tasks</span>
          </Link>
        </>
      );
    } else if (role === "user") {
      return (
        <>
          <Link
            to="/home"
            onClick={() => handleMenuItemClick("Home")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Home" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/userService"
            onClick={() => handleMenuItemClick("Services")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Services" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faThLarge} />
            <span className="text-xs">Services</span>
          </Link>
          <Link
            to="/userActivity"
            onClick={() => handleMenuItemClick("Activity")}
            className={`flex flex-col items-center ${
              activeMenuItem === "Activity" ? "text-black" : "text-gray-300"
            }`}
          >
            <FontAwesomeIcon icon={faReceipt} />
            <span className="text-xs">Activity</span>
          </Link>
        </>
      );
    }
  };

  return (
    <nav
      className={`bg-white text-white flex justify-around p-4 fixed bottom-0 w-full lg:hidden ${className}`}
    >
      {renderNavItems()}
    </nav>
  );
};

export default BottomNav;
