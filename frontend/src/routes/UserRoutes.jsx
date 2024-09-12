import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthProvider"; // Assuming AuthProvider manages user login state
import UserTestPage from "../components/common/UserTestPage";

function UserRoutes() {
  const { userLoggedIn } = useAuth(); // Using userLoggedIn from the authentication context

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
      <Route path="/register" element={<UserTestPage />} />
      <Route
        path="/home"
        element={<ProtectedRoute element={<UserTestPage />} />}
      />
      <Route
        path="/services"
        element={<ProtectedRoute element={<UserTestPage />} />}
      />
      <Route
        path="/activity"
        element={<ProtectedRoute element={<UserTestPage />} />}
      />
    </Routes>
  );
}

export default UserRoutes;
