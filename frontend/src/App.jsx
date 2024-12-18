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
import { getAllVehicles, getNotifications } from "./api/functions";

export function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const { currentUser, userLoggedIn, loading } = useAuth();
  const [role, setRole] = useState("staff");
  const [vehicles, setVehicles] = useState([]); // Add state for vehicles
  const [notifs, setNotifs] = useState([]); // Add state for notifs

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
    const fetchVehicles = async () => {
      try {
        const vehicleData = await getAllVehicles();
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error.message);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const notifData = await getNotifications();
        setNotifs(notifData);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifs();
  }, []);

  useEffect(() => {
    console.log("Current pathname:", location.pathname);
    if (location.pathname.startsWith("/scheduledetails/")) {
      console.log("Matched /scheduledetails/ route");
      setActiveMenuItem("Update Bus Schedule");
    } else {
      switch (location.pathname) {
        case "/home":
        case "/":
          setActiveMenuItem("Home");
          break;
        case "/staffanalytics":
          setActiveMenuItem("Analytics");
          break;

        case "/confirmation":
          setActiveMenuItem("Services");
          break;
        case "/profile":
          setActiveMenuItem("Profile");
          break;
        case "/userRental":
          setActiveMenuItem("home");
          break;
        case "/Reserve/undefined":
          setActiveMenuItem("Services");
          break;
        case "/finalDetails":
          setActiveMenuItem("Services");
          break;

        case "/Book/undefined":
          setActiveMenuItem("Services");
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
        case "/userFind":
          setActiveMenuItem("Home");
          break;

        case "/userService":
          setActiveMenuItem("Services");
          break;

        case "/userActivity":
          setActiveMenuItem("Activity");
          break;
        case "/UserBuses":
          setActiveMenuItem("Services");
          break;
        case "/UserBusSchedule":
          setActiveMenuItem("Services");
          break;

        case "/scheduledetails/:id":
          console.log("Matched /scheduledetails/:id route");
          setActiveMenuItem("Update Bus Schedule");
          break;
        case "/vehicles":
          setActiveMenuItem("Vehicles");
          break;
        case "/Returns":
          setActiveMenuItem("Services");
        case "/ReturnConfirmation":
          setActiveMenuItem("Vehicles");
          break;
          break;
        default:
          console.log("No match found, clearing activeMenuItem");
          setActiveMenuItem("");
          break;
      }
    }
  }, [location.pathname]);

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const renderRoutes = () => {
    if (role === "staff") {
      return (
        <StaffRoutes
          vehicles={vehicles}
          notifs={notifs}
          currentUser={currentUser}
        />
      );
    } else if (role === "user") {
      return <UserRoutes currentUser={currentUser} />;
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
          <DesktopHeader currentUser={currentUser}></DesktopHeader>
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
      {userLoggedIn && <MobileHeader />}
    </div>
  );
}

export default App;
