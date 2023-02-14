import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const UserMenu = ({ user }) => {
  const menuRef = useRef();
  const authCtx = useContext(AuthContext);

  const toggleMenuHandler = () => {
    menuRef.current.classList.toggle("hidden");
  };

  const hideMenuHandler = () => {
    menuRef.current.classList.delete("hidden");
  };

  return (
    <>
      <div className="user-menu">
        <div className="user-menu__img-container">
          <img
            className="user-menu__img"
            src={user.profile_picture_url}
            alt="profile picture"
            onClick={toggleMenuHandler}
          />
        </div>
        <div className="user-menu__menu" ref={menuRef}>
          <Link to="/me" className="user-menu__link">
            {user.name}
          </Link>
          <Link to="/posts/new" className="user-menu__link">
            Create post
          </Link>
          <Link to="#" className="user-menu__link">
            Read later
          </Link>
          <button className="user-menu__link" onClick={authCtx.logout}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
