import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";

const UserDetail = ({ user }) => {
  const authCtx = useContext(AuthContext);

  return (
    <div className="user-detail">
      <div className="user-detail__img-container">
        <ProfilePicture profile_picture_url={user.profile_picture_url} />
      </div>
      <h1>{user.name}</h1>
      {authCtx.user?.name === user.name && (
        <Link to="edit" className="account-btn user-detail__edit-profile-btn">
          Edit profile
        </Link>
      )}
      <p className="user-detail__date-joined">
        Joined on {new Date(user.created).toDateString()}
      </p>
      <div className="user-detail__decription-container">
        <h4 className="user-detail__description">
          {user.description || "No description provided..."}
        </h4>
      </div>
      <div className="user-detail__info">
        <div className="user-detail__posts-info">
          <ArticleIcon />
          <p className="user-detail__num-posts">
            Posts published: {user.number_of_posts}
          </p>
        </div>
        <div className="user-detail__comments-info">
          <CommentIcon />
          <p className="user-detail__num-comments">
            Comments made: {user.number_of_comments}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
