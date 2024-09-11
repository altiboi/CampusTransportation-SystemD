import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffHomePage from "../pages/staffPages/StaffHomePage";
import StaffAnalyticsPage from "../pages/staffPages/StaffAnalyticsPage";
import StaffTasksPage from "../pages/staffPages/StaffTasksPage";
import StaffUpdateBusSchedulePage from "../pages/staffPages/StaffUpdateBusSchedulePage";
import ScheduleDetailsPage from "../pages/staffPages/ScheduleDetailsPage";
import VehiclesPage from "../pages/staffPages/VehiclesPage";
import NotificationsPage from "../pages/staffPages/NotificationsPage";

function StaffRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StaffHomePage />} />
      <Route path="/home" element={<StaffHomePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/staffanalytics" element={<StaffAnalyticsPage />} />
      <Route
        path="/scheduledetails/:id"
        element={<ScheduleDetailsPage />}
      />{" "}
      {/* Route for schedule details */}
      <Route path="/stafftasks" element={<StaffTasksPage />} />
      <Route
        path="/updatebusschedule"
        element={<StaffUpdateBusSchedulePage />}
      />
      <Route path="/vehicles" element={<VehiclesPage />} />
    </Routes>
  );
}

export default StaffRoutes;
