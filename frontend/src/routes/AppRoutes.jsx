import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffHomePage from "../pages/staffPages/StaffHomePage";
import StaffAnalyticsPage from "../pages/staffPages/StaffAnalyticsPage";
import StaffTasksPage from "../pages/staffPages/StaffTasksPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StaffHomePage />} />
      <Route path="/staffhome" element={<StaffHomePage />} />
      <Route path="/staffanalytics" element={<StaffAnalyticsPage />} />
      <Route path="/stafftasks" element={<StaffTasksPage />} />
    </Routes>
  );
}

export default AppRoutes;
