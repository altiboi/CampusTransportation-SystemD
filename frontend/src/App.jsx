// src/App.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import BottomNav from "./components/common/BottomNav";
import AppRoutes from "./routes/AppRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import UserRoutes from "./routes/UserRoutes";
import { AppProvider, useAppContext } from "./context/AppContext";
import MobileHeader from "./components/common/MobileHeader";
import DesktopHeader from "./components/common/DesktopHeader";

export function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [role, setRole] = useState("staff"); // Default role
  const location = useLocation();
  const { task } = useAppContext(); // Access the task value from the context

  useEffect(() => {
    switch (location.pathname) {
      case "/staffhome":
        setActiveMenuItem("Home");
        break;
      case "/staffanalytics":
        setActiveMenuItem("Analytics");
        break;
      case "/stafftasks":
        setActiveMenuItem("Tasks");
        break;
      case "/notifications":
        setActiveMenuItem("Create Notification");
        break;
      case "/updatebusschedule":
        setActiveMenuItem("Update Bus Schedule");
        break;
      case "//scheduledetails/:id":
        setActiveMenuItem("Update Bus Schedule");
        break;
      case "/vehicles":
        setActiveMenuItem("Vehicles");
        break;
    }
  }, [location.pathname]);

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const renderRoutes = () => {
    if (role === "staff") {
      return <StaffRoutes />;
    } else if (role === "user") {
      return <UserRoutes />;
    } else {
      return <AppRoutes />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        role={role}
      />
      <div className="flex-1 flex flex-col ml-1/4">
        {" "}
        {/* Adjusted for sidebar width */}
        <DesktopHeader />
        <div className="flex-1 overflow-y-auto">{renderRoutes()}</div>
        <BottomNav
          activeMenuItem={activeMenuItem}
          handleMenuItemClick={handleMenuItemClick}
          role={role}
          className={`${task === 1 ? "hidden" : ""}`} // Conditionally hide BottomNav
        />
      </div>
      <MobileHeader /> {/* Ensure this is positioned correctly */}
    </div>
  );
}

export default App;
