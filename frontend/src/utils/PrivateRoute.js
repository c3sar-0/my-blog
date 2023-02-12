import { Navigate, Outlet } from "react-router-dom";

import React from "react";

const PrivateRoute = () => {
  return localStorage.access ? <Outlet /> : <Navigate to="/auth?mode=login" />;
};

export default PrivateRoute;
