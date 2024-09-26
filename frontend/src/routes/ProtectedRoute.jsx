import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const ProtectedRoute = ({ element }) => {
  const { userLoggedIn } = useAuth();

  // Return the protected element if the user is logged in, otherwise redirect to login
  return userLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
