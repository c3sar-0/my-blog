import React, { useContext, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import apiRequest from "../utils/apiRequest";

const Sidebar = () => {
  const authCtx = useContext(AuthContext);
  const { showSidebar } = useOutletContext();
  const [tags, setTags] = useState(null);

  useEffect(() => {
    // const getData = () => {
    //   // const data = await apiRequest(process.env.REACT_APP_API_URL + "blog/tags");
    //   return apiRequest(process.env.REACT_APP_API_URL + "blog/tags");
    // };
    // const tags = getData().then((data) => data);
    const tags = apiRequest(process.env.REACT_APP_API_URL + "blog/tags");
    tags.then((data) => setTags(data));
  }, []);

  return (
    <>
      <div
        className={`sidebar__overlay ${
          showSidebar ? "sidebar__overlay--visible" : "sidebar__overlay--hidden"
        }`}
      ></div>
      <div
        className={`sidebar ${
          showSidebar ? "sidebar--visible" : "sidebar--hidden"
        }`}
      >
        <div className="sidebar__welcome">
          <p>
            Welcome to{" "}
            <span className="sidebar__bytebusters">ByteBusters!</span>
          </p>
          <p className="sidebar__welcome-content">
            ByteBusters is a blog page created to have fun and share interesting
            things with the world. Anything you like or find fascinating, post
            it! You can interact with people, read and create posts and much
            more!
          </p>
        </div>

        {!authCtx.isLoggedIn && (
          <div className="sidebar__create-account">
            <p>
              Create an account to create your own posts, enter discussions,
              save and like your favourite posts, and more!
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
            {tags &&
              tags.map((tag, i) => (
                <li key={i} className="sidebar__tag-item">
                  <Link to={`/?tag=${tag}`}>{tag}</Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
