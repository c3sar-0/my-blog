import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <section className="sidebar">
      <div className="sidebar__create-account">
        <p>
          Create an account to create your own posts, enter discussions, save
          and like your favourite posts, and more!
        </p>
        <NavLink to="/auth?mode=register" className="account-btn">
          Create Account
        </NavLink>
      </div>

      <div className="sidebar__feeds">
        <p>Feeds</p>
        <p>🏠 Home</p>
        <p>🔖 Saved</p>
        <p>💖 Liked</p>
      </div>
    </section>
  );
};

export default Sidebar;
