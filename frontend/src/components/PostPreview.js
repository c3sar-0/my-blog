import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const PostPreview = (props) => {
  const post = props.post;
  return (
    <section className="post-preview">
      <div className="post-preview__img-container">
        <img src={post.image_url} alt="Post" />
      </div>
      <div className="post-preview__content">
        <div className="post-preview__author">
          <div className="post-preview__author-img-container">
            <ProfilePicture
              profile_picture_url={post.author.profile_picture_url}
            />
          </div>
          <div>
            <p className="post-preview__author-name">{post.author.name}</p>
            <p className="post-preview__date">
              {new Date(post.created).toDateString()}
            </p>
          </div>
        </div>
        <div className="post-preview__title-container">
          <Link to={`/posts/${post.id}`} className="post-preview__title">
            {post.title.toUpperCase()}
          </Link>
        </div>
        <div className="post-preview__info">
          <div className="post-preview__tags">#insert #tags #here</div>
          <div className="post-preview__actions">
            <div className="post-preview__comments">
              <CommentIcon />
            </div>
            <div className="post-preview__likes">
              {post.is_liked_by_user ? (
                <FavoriteIcon className="post-preview__favourite-btn--active" />
              ) : (
                <FavoriteBorderIcon className="post-preview__favourite-btn" />
              )}
              <p>{post.likes}</p>
            </div>
            <div className="post-preview__bookmark">
              <BookmarkBorderIcon />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPreview;
