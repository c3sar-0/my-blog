import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { NavLink, Link, useSearchParams } from "react-router-dom";
import byteBustersLogo from "../assets/ByteBustersLogoTransparent.png";
import UserMenu from "./UserMenu";

import SearchIcon from "@mui/icons-material/Search";

const RootHeader = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const me = authCtx.user;
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <header className="root-header">
      <NavLink className="root-header__link" to="/">
        <img className="root-header__logo" src={byteBustersLogo} />
      </NavLink>
      <form className="root-header__search-form">
        <button className="root-header__btn" type="submit">
          <SearchIcon className="root-header__search-icon" />
        </button>
        <input
          className="root-header__search-form--bar"
          placeholder="Search..."
        />
      </form>
      {!me && (
        <nav className="root-header__nav">
          <Link
            className={`account-btn ${
              searchParams.get("mode") === "login" ? "active" : ""
            }`}
            to="/auth?mode=login"
          >
            Log In
          </Link>
          <Link
            className={`account-btn ${
              searchParams.get("mode") === "register" ? "active" : ""
            }`}
            to="/auth?mode=register"
          >
            Create Account
          </Link>
        </nav>
      )}
      {me && (
        <div className="root-header__user">
          <a href="/posts/new" className="account-btn">
            New Post
          </a>
          <UserMenu user={me} />
        </div>
      )}
    </header>
  );
};

export default RootHeader; /*

/*
<header className="root-header">
      <nav className="root-header__nav">
        <div className="root-header__container">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "root-header__nav active" : ""
            }
          >
            <h3>Home</h3>
          </NavLink>
          <NavLink
            to="posts"
            className={({ isActive }) =>
              isActive ? "root-header__nav active" : ""
            }
            end
          >
            <h3>Posts</h3>
          </NavLink>
          <NavLink
            to="posts/new"
            className={({ isActive }) =>
              isActive ? "root-header__nav active" : ""
            }
          >
            <h3>New Post</h3>
          </NavLink>
          {/* <a>Hello, {authCtx.name}</a> */ /*
          </div>
          {!isLoggedIn && (
            <div className="root-header__container">
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  isActive ? "root-header__nav active" : ""
                }
              >
                <h3>Login</h3>
              </NavLink>
            </div>
          )}
          {isLoggedIn && me && (
            <div className="root-header__container">
              <NavLink
                to="/me"
                className={({ isActive }) =>
                  isActive ? "root-header__nav active" : ""
                }
              >
                <h3>{me.name}</h3>
              </NavLink>
              <h3
                className="root-header__container--logout"
                onClick={logoutHandler}
              >
                Logout
              </h3>
            </div>
          )}
        </nav>
      </header>
*/
