import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Sidebar = ({ tags }) => {
  const authCtx = useContext(AuthContext);
  console.log(tags);
  return (
    <section className="sidebar">
      {!authCtx.isLoggedIn && (
        <div className="sidebar__create-account">
          <p>
            Create an account to create your own posts, enter discussions, save
            and like your favourite posts, and more!
          </p>
          <Link to="/auth?mode=register" className="account-btn">
            Create Account
          </Link>
        </div>
      )}

      <div className="sidebar__feeds">
        <p>Feeds</p>
        <p>🏠 Home</p>
        <p>🔖 Saved</p>
        <p>💖 Liked</p>
      </div>

      <ul className="sidebar__tags">
        {tags.map((tag, i) => (
          <li key={i}>{tag}</li>
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
