import React from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";

const PrivateRoute = () => {
  const rootContext = useOutletContext();

  return localStorage.access ? (
    <Outlet context={rootContext} />
  ) : (
    <Navigate to="/auth?mode=login" />
  );
};

export default PrivateRoute;
