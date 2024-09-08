import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import BottomNav from "./components/common/BottomNav";
import StaffHomePage from "./pages/staffPages/StaffHomePage";
import AppRoutes from "./routes/AppRoutes";

export function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: Hidden on small screens, visible on medium and up */}
      <Sidebar
        className="hidden md:flex flex-shrink-0"
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <AppRoutes></AppRoutes>
      </div>

      {/* BottomNav: Hidden on medium and up, visible on small screens */}
      <BottomNav
        className="md:hidden flex-shrink-0"
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />
    </div>
  );
}

export default App;
