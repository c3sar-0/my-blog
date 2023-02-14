import React from "react";
import { Outlet } from "react-router-dom";

import RootHeader from "../components/RootHeader";

const RootLayout = () => {
  return (
    <>
      <RootHeader />
      <Outlet />
    </>
  );
};

export default RootLayout;
