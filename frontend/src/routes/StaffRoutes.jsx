import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffHomePage from "../pages/staffPages/StaffHomePage";
import StaffAnalyticsPage from "../pages/staffPages/StaffAnalyticsPage";
import StaffTasksPage from "../pages/staffPages/StaffTasksPage";
import StaffUpdateBusSchedulePage from "../pages/staffPages/StaffUpdateBusSchedulePage";

function StaffRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StaffHomePage />} />
      <Route path="/home" element={<StaffHomePage />} />
      <Route path="/staffanalytics" element={<StaffAnalyticsPage />} />
      <Route path="/stafftasks" element={<StaffTasksPage />} />
      <Route
        path="/updatebusschedule"
        element={<StaffUpdateBusSchedulePage />}
      />
    </Routes>
  );
}

export default StaffRoutes;
