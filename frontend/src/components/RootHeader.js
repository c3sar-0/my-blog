import React, { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { NavLink, Link, useSearchParams, useNavigate } from "react-router-dom";
import byteBustersLogo from "../assets/ByteBustersLogoTransparent.png";
import UserMenu from "./UserMenu";

import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

const RootHeader = ({ toggleSidebar }) => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const me = authCtx.user;
  const [searchParams, setSearchParams] = useSearchParams();

  const searchRef = useRef();
  const navigate = useNavigate();

  const searchHandler = async (e) => {
    e.preventDefault();
    navigate(`/?search=${searchRef.current.value}`);
  };

  return (
    <header className="root-header">
      <div className="root-header__sidebar-menu" onClick={toggleSidebar}>
        <MenuIcon />
      </div>
      <NavLink className="root-header__link" to="/">
        <img className="root-header__logo" src={byteBustersLogo} />
      </NavLink>
      <form className="root-header__search-form" onSubmit={searchHandler}>
        <button className="root-header__search-btn" type="submit">
          <SearchIcon className="root-header__search-icon" />
        </button>
        <input
          className="root-header__search-form--bar"
          placeholder="Search..."
          ref={searchRef}
        />
      </form>
      {!isLoggedIn && (
        <nav className="root-header__nav">
          <Link
            className={`account-btn account-btn__login ${
              searchParams.get("mode") === "login" ? "active" : ""
            }`}
            to="/auth?mode=login"
          >
            Log In
          </Link>
          <Link
            className={`account-btn account-btn__create ${
              searchParams.get("mode") === "register" ? "active" : ""
            }`}
            to="/auth?mode=register"
          >
            Create Account
          </Link>
        </nav>
      )}
      <div className="root-header__user">
        {isLoggedIn && me && (
          <>
            <Link
              to="/posts/new"
              className="account-btn root-header__new-post-btn"
            >
              New Post
            </Link>
            <div className="root-header__user-menu">
              <UserMenu user={me} />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default RootHeader;
