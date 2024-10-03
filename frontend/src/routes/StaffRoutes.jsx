// src/routes/StaffRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StaffHomePage from "../pages/staffPages/StaffHomePage";
import StaffAnalyticsPage from "../pages/staffPages/StaffAnalyticsPage";
import StaffTasksPage from "../pages/staffPages/StaffTasksPage";
import StaffUpdateBusSchedulePage from "../pages/staffPages/StaffUpdateBusSchedulePage";
import ScheduleDetailsPage from "../pages/staffPages/ScheduleDetailsPage";
import VehiclesPage from "../pages/staffPages/VehiclesPage";
import NotificationsPage from "../pages/staffPages/NotificationsPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthProvider";
import NotFoundPage from "../pages/NotFoundPage"; // Import the NotFoundPage component

function StaffRoutes({ vehicles , notifs ,currentUser}) {
  const { userLoggedIn } = useAuth();



  return (
    <Routes>
      <Route
        path="/"
        element={
          userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={userLoggedIn ? <Navigate to="/home" /> : <Login />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={<ProtectedRoute element={<StaffHomePage currentUser={currentUser} vehicles={vehicles}/>} />}
      />
      <Route
        path="/notifications"
        element={<ProtectedRoute element={<NotificationsPage notifs = {notifs} currentUser = {currentUser}/>} />}
      />
      <Route
        path="/staffanalytics"
        element={<ProtectedRoute element={<StaffAnalyticsPage vehicles={vehicles}/>} />}
      />
      <Route
        path="/scheduledetails/:id"
        element={<ProtectedRoute element={<ScheduleDetailsPage />} />}
      />
      <Route
        path="/stafftasks"
        element={<ProtectedRoute element={<StaffTasksPage />} />}
      />
      <Route
        path="/updatebusschedule"
        element={<ProtectedRoute element={<StaffUpdateBusSchedulePage />} />}
      />
      <Route
        path="/vehicles"
        element={<ProtectedRoute element={<VehiclesPage vehicles={vehicles}/>} />}
      />
      {/* Catch-all route for undefined paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default StaffRoutes;
