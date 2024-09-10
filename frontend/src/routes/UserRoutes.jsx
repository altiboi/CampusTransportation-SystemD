import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffHomePage from "../pages/staffPages/StaffHomePage";
import StaffAnalyticsPage from "../pages/staffPages/StaffAnalyticsPage";
import StaffTasksPage from "../pages/staffPages/StaffTasksPage";
import UserTestPage from "../components/common/UserTestPage";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserTestPage />} />
      <Route path="/home" element={<UserTestPage />} />
      <Route path="/staffanalytics" element={<StaffAnalyticsPage />} />
      <Route path="/stafftasks" element={<StaffTasksPage />} />
    </Routes>
  );
}

export default UserRoutes;
