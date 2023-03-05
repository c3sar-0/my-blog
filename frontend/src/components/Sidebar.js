import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Sidebar = ({ tags }) => {
  const authCtx = useContext(AuthContext);

  return (
    <section className="sidebar">
      <div className="sidebar__welcome">
        <p>
          Welcome to <span className="sidebar__bytebusters">ByteBusters!</span>
        </p>
        <p className="sidebar__welcome-content">
          ByteBusters is a blog page created to have fun and share interesting
          things with the world. Anything you like or find fascinating, post it!
          You can interact with people, read and create posts and much more!
        </p>
      </div>

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
        <p className="sidebar__feeds-header">Feeds</p>
        <p>🏠 Home</p>
        <p>🔖 Saved</p>
        <p>💖 Liked</p>
      </div>

      <div className="sidebar__tags">
        <h2 className="sidebar__tags-header">Tags</h2>
        <ul className="sidebar__tag-list">
          {tags.map((tag, i) => (
            <li key={i} className="sidebar__tag-item">
              <Link to={`/?tag=${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Sidebar;
