// src/routes/UserRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserHome from "../pages/UserPages/UserHome";
import UserService from "../pages/UserPages/UserService";
import Find from "../pages/UserPages/Find";
import Rental from "../pages/UserPages/Rental";
import Book from "../pages/UserPages/Book";
import Reserve from "../pages/UserPages/Reserve";
import Confirmation from "../pages/UserPages/Confirmation";
import FinalDetails from "../pages/UserPages/FinalDetails";
import UserActivity from "../pages/UserPages/UserActivity";
import UserFines from "../pages/UserPages/UserFines";
import UserPayments from "../pages/UserPages/UserPayments";
import UserBuses from "../pages/UserPages/UserBuses";
import Login from "../pages/Login"; // Assuming login and register pages are the same as in StaffRoutes
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthProvider";
import NotFoundPage from "../pages/NotFoundPage"; // Optional: Catch-all route for undefined paths
import UserWhereTo from "../pages/UserPages/UserWherTo";
import NotificationsPage from "../pages/UserPages/UserNotification";
import UserBusSchedule from "../pages/UserPages/UserBusSchedule";
import UserMap from "../pages/UserPages/UserMap";
import Returns from "../pages/UserPages/Returns";
import ReturnConfirmation from "../pages/UserPages/ReturnConfirmation";
import ScheduleDetailsPage from "../pages/staffPages/ScheduleDetailsPage";
import ProfilePage from "../components/ProfilePage";
import UserFrom from "../pages/UserPages/UserFrom";

function UserRoutes({ currentUser }) {
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

      <Route path="/home" element={<ProtectedRoute element={<UserHome />} />} />
      <Route
        path="/userService"
        element={<ProtectedRoute element={<UserService />} />}
      />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/userFind" element={<ProtectedRoute element={<Find />} />} />
      <Route
        path="/userRental"
        element={<ProtectedRoute element={<Rental />} />}
      />
      <Route
        path="/Returns"
        element={
          <ProtectedRoute element={<Returns currentUser={currentUser} />} />
        }
      />
      <Route
        path="/ReturnConfirmation"
        element={<ProtectedRoute element={<ReturnConfirmation />} />}
      />
      <Route
        path="/book/:itemName"
        element={<ProtectedRoute element={<Book />} />}
      />
      <Route
        path="/reserve/:itemName"
        element={<ProtectedRoute element={<Reserve />} />}
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute
            element={<Confirmation currentUser={currentUser} />}
          />
        }
      />
      <Route
        path="/finalDetails"
        element={<ProtectedRoute element={<FinalDetails />} />}
      />
      <Route
        path="/userActivity"
        element={
          <ProtectedRoute
            element={<UserActivity currentUser={currentUser} />}
          />
        }
      />
      <Route
        path="/userFines"
        element={
          <ProtectedRoute element={<UserFines currentUser={currentUser} />} />
        }
      />
      <Route
        path="/userPayments"
        element={<ProtectedRoute element={<UserPayments />} />}
      />
      <Route
        path="/userBuses"
        element={<ProtectedRoute element={<UserBuses />} />}
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            element={<NotificationsPage currentUser={currentUser} />}
          />
        }
      />
      <Route
        path="/UserWhereTo"
        element={<ProtectedRoute element={<UserWhereTo />} />}
      />
      <Route
        path="/UserBusSchedule"
        element={<ProtectedRoute element={<UserBusSchedule />} />}
      />
      <Route
        path="/scheduledetails/:id"
        element={<ProtectedRoute element={<ScheduleDetailsPage />} />}
      />
      <Route
        path="/UserMap"
        element={<ProtectedRoute element={<Find />} />}
      />
      <Route path="/From" element={<ProtectedRoute element={<UserFrom />} />} />
      {/* Optional: Catch-all route for undefined paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default UserRoutes;
