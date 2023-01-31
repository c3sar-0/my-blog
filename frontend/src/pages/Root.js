import React, { useContext } from "react";
import classes from "./Root.module.css";
import { Outlet, NavLink, useLoaderData } from "react-router-dom";

import AuthContext from "../context/AuthContext";

const RootLayout = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const me = authCtx.user;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <div className={classes.container}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              <h3>Home</h3>
            </NavLink>
            <NavLink
              to="posts"
              className={({ isActive }) => (isActive ? classes.active : "")}
              end
            >
              <h3>Posts</h3>
            </NavLink>
            <NavLink
              to="posts/new"
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              <h3>New Post</h3>
            </NavLink>
            {/* <a>Hello, {authCtx.name}</a> */}
          </div>
          {!isLoggedIn && (
            <div className={classes.container}>
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                <h3>Login</h3>
              </NavLink>
            </div>
          )}
          {isLoggedIn && me && (
            <div className={classes.container}>
              <NavLink
                to="/me"
                className={({ isActive }) => (isActive ? classes.active : "")}
              >
                <h3>{me.name}</h3>
              </NavLink>
              <h3 className={classes.logout} onClick={logoutHandler}>
                Logout
              </h3>
            </div>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default RootLayout;
