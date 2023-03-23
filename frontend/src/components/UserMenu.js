import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";

const UserMenu = ({ user }) => {
  const menuRef = useRef();
  const authCtx = useContext(AuthContext);

  const toggleMenuHandler = () => {
    menuRef.current.classList.toggle("user-menu__menu--hidden");
    menuRef.current.classList.toggle("user-menu__menu--visible");
  };

  return (
    <>
      <div className="user-menu">
        <div className="user-menu__img-container">
          <ProfilePicture
            onClick={toggleMenuHandler}
            profile_picture_url={user?.profile_picture_url}
          />
        </div>
        <div className="user-menu__menu user-menu__menu--hidden" ref={menuRef}>
          {user ? (
            <>
              <Link
                to={`/user/${authCtx.user.slug}`}
                className="user-menu__link"
              >
                {user.name}
              </Link>
              <Link to="/posts/new" className="user-menu__link">
                Create post
              </Link>
              <Link to="/read-later" className="user-menu__link">
                Read later
              </Link>
              <button className="user-menu__link" onClick={authCtx.logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className={"account-btn"} to="/auth?mode=login">
                Log In
              </Link>
              <Link className={"account-btn"} to="/auth?mode=register">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserMenu;
