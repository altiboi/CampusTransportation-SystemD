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
import Returns from "../pages/UserPages/Returns";
import ReturnConfirmation from "../pages/UserPages/ReturnConfirmation.jsx";
function UserRoutes() {
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
      <Route path="/userFind" element={<ProtectedRoute element={<Find />} />} />
      <Route
        path="/userRental"
        element={<ProtectedRoute element={<Rental />} />}
      />
         <Route
        path="/Returns"
        element={<ProtectedRoute element={<Returns />} />}
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
        element={<ProtectedRoute element={<Confirmation />} />}
      />
      <Route
        path="/finalDetails"
        element={<ProtectedRoute element={<FinalDetails />} />}
      />
      <Route
        path="/userActivity"
        element={<ProtectedRoute element={<UserActivity />} />}
      />
      <Route
        path="/userFines"
        element={<ProtectedRoute element={<UserFines />} />}
      />
      <Route
        path="/userPayments"
        element={<ProtectedRoute element={<UserPayments />} />}
      />
      <Route
        path="/userBuses"
        element={<ProtectedRoute element={<UserBuses />} />}
      />
      {/* Optional: Catch-all route for undefined paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default UserRoutes;
