// src/App.js
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import BottomNav from "./components/common/BottomNav";
import AppRoutes from "./routes/AppRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import UserRoutes from "./routes/UserRoutes";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import MobileHeader from "./components/common/MobileHeader";
import DesktopHeader from "./components/common/DesktopHeader";
import { useAuth } from "./contexts/AuthProvider";

export function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const { currentUser, userLoggedIn, loading } = useAuth();
  const [role, setRole] = useState("staff");
  const location = useLocation();
  const { task } = useAppContext();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          setRole(currentUser.role);
        } catch (error) {
          console.error("Failed to get user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [currentUser]);

  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        setActiveMenuItem("Home");
        break;
      case "/staffanalytics":
        setActiveMenuItem("Analytics");
        break;
      case "/stafftasks":
        setActiveMenuItem("Tasks");
        break;
      case "/updatebusschedule":
        setActiveMenuItem("Update Bus Schedule");
        break;
      case "/notifications":
        setActiveMenuItem("Create Notification");
        break;
      case "/services":
        setActiveMenuItem("Services");
        break;
      case "/activity":
        setActiveMenuItem("Activity");
        break;
      case "/scheduledetails/:id":
        setActiveMenuItem("Update Bus Schedule");
        break;
      case "/vehicles":
        setActiveMenuItem("Vehicles");
        break;
      default:
        setActiveMenuItem(""); // Clear active menu item if path doesn't match
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

  // Check if the current route is the NotFound page (404)
  const isNotFoundRoute = location.pathname === "/404" || !activeMenuItem;

  return (
    <div className="flex h-screen overflow-hidden">
      {userLoggedIn && !loading && !isNotFoundRoute && (
        <>
          <Sidebar
            activeMenuItem={activeMenuItem}
            handleMenuItemClick={handleMenuItemClick}
            role={role}
          />
          <DesktopHeader />
        </>
      )}
      <div className={`flex-1 flex flex-col ${userLoggedIn ? "ml-1/4" : ""}`}>
        <div className="flex-1 overflow-y-auto">{renderRoutes()}</div>
        {userLoggedIn && !isNotFoundRoute && (
          <BottomNav
            activeMenuItem={activeMenuItem}
            handleMenuItemClick={handleMenuItemClick}
            role={role}
            className={`${task === 1 ? "hidden" : ""}`}
          />
        )}
      </div>
      {userLoggedIn && !isNotFoundRoute && <MobileHeader />}
    </div>
  );
}

export default App;
