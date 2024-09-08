// components/Sidebar.js
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ activeMenuItem, handleMenuItemClick }) => {
  // If not authenticated, do not render the sidebar

  return (
    <div className="bg-gray-100 text-white w-1/4 flex flex-col pl-4 max-w-64 relative hidden lg:flex flex-shrink-0">
      <div className="px-6 py-3 text-xl font-bold text-black mt-10 mb-10">
        {activeMenuItem}
      </div>
      <Link
        to="/staffhome"
        className={`flex items-center justify-start px-4 py-3 ${
          activeMenuItem === "Home"
            ? "bg-gray-700 text-gray-200 font-bold text-sm rounded-lg"
            : "text-gray-700 font-bold text-sm"
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
            ? "bg-gray-700 text-gray-200 font-bold text-sm rounded-lg"
            : "text-gray-700 font-bold text-sm"
        }`}
        onClick={() => handleMenuItemClick("Analytics")}
      >
        <FontAwesomeIcon icon={faChartLine} className="mr-2" />
        Analytics
      </Link>
      <Link
        to="/Stafftasks"
        className={`flex items-center justify-start px-4 py-3 ${
          activeMenuItem === "Tasks"
            ? "bg-gray-700 text-gray-200 font-bold text-sm rounded-lg"
            : "text-gray-700 font-bold text-sm"
        }`}
        onClick={() => handleMenuItemClick("Tasks")}
      >
        <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
        Tasks
      </Link>

      {/* Logout Button */}
    </div>
  );
};

export default Sidebar;
