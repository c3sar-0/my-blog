import { Navigate, Outlet } from "react-router-dom";

import React from "react";

const PrivateRoute = () => {
  return localStorage.refresh ? <Outlet /> : <Navigate to="/auth?mode=login" />;
};

export default PrivateRoute;
