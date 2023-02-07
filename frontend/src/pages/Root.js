import React, { useContext } from "react";
import { Outlet, NavLink, useLoaderData } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import RootHeader from "../components/RootHeader";

const RootLayout = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const me = authCtx.user;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <>
      <RootHeader
        isLoggedIn={isLoggedIn}
        me={me}
        logoutHandler={logoutHandler}
      />
      <Outlet />
    </>
  );
};

export default RootLayout;
