import React, { useRef } from "react";

const UserMenu = ({ user }) => {
  const menuRef = useRef();

  const toggleMenuHandler = () => {
    // console.log(menuRef.current.classList.toggle("hidden"));
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
          <a href="#" className="user-menu__link">
            {user.name}
          </a>
          <a href="#" className="user-menu__link">
            Create post
          </a>
          <a href="#" className="user-menu__link">
            Read later
          </a>
          <a href="#" className="user-menu__link">
            Sign out
          </a>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
