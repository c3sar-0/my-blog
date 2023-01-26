import React, { useContext } from "react";
import classes from "./Root.module.css";
import { Outlet, NavLink } from "react-router-dom";

import AuthContext from "../context/AuthContext";

const RootLayout = () => {
  const ctx = useContext(AuthContext);

  const logoutHandler = () => {
    ctx.logout();
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
            {/* <a>Hello, {ctx.name}</a> */}
          </div>
          <div className={classes.container}>
            <NavLink
              to="/auth?mode=login"
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              <h3>Login</h3>
            </NavLink>
          </div>
          <button onClick={logoutHandler}>Logout</button>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default RootLayout;
