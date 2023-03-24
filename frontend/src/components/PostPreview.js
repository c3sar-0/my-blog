import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import apiRequest from "../utils/apiRequest";
import AuthorHeader from "./AuthorHeader";

const PostPreview = (props) => {
  const post = props.post;
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likes, setLikes] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked_by_user);
  const postPreviewRef = useRef();

  const likePostHandler = async () => {
    let method = "POST";
    if (isLiked) {
      method = "DELETE";
    }
    const response = await fetch(
      process.env.REACT_APP_API_URL + `blog/posts/${post.id}/like/`,
      {
        method: method,
        headers: { Authorization: "Bearer " + localStorage.access },
        body: {},
      }
    );
    if (!response.ok) {
      console.log(response);
      return;
    }
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikes((prev) => Number(prev) + 1);
    }
  };

  const bookmarkPostHandler = async () => {
    let method = "POST";
    if (isBookmarked) {
      method = "DELETE";
    }

    await apiRequest(
      process.env.REACT_APP_API_URL + `blog/posts/${post.id}/bookmark/`,
      method
    );

    if (isBookmarked) {
      setIsBookmarked(false);
    } else {
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    if (!post.image_url) {
      postPreviewRef.current.style["min-height"] = "0";
    }
  });

  return (
    <article className="post-preview" ref={postPreviewRef}>
      {post.image_url && (
        <div className="post-preview__img-container-wrapper">
          <div className="post-preview__img-container">
            <img
              src={post.image_url}
              alt="Post"
              className="post-preview__img"
            />
          </div>
        </div>
      )}
      <div
        className={`post-preview__content ${
          post.image_url ? "" : "post-preview__content--horizontal"
        }`}
      >
        <AuthorHeader author={post.author} date={post.created} />
        <div className="post-preview__title-container">
          <Link to={`/posts/${post.id}`} className="post-preview__title">
            <p>{post.title.toUpperCase()}</p>
          </Link>
        </div>
        <div className="post-preview__info">
          <ul className="post-preview__tags">
            {post.tags.map((tag) => (
              <li key={tag.id}>
                <Link to={`/?tag=${tag.text}`}>{tag.text}</Link>
              </li>
            ))}
          </ul>
          <div className="post-preview__actions">
            <div className="post-preview__comments">
              <CommentIcon />
              <p>{post.comments}</p>
            </div>
            <div className="post-preview__likes">
              {isLiked ? (
                <FavoriteIcon
                  className="post-preview__favourite-btn--active"
                  onClick={likePostHandler}
                />
              ) : (
                <FavoriteBorderIcon
                  className="post-preview__favourite-btn"
                  onClick={likePostHandler}
                />
              )}
              <p>{likes}</p>
            </div>
            <div className="post-preview__bookmark">
              {isBookmarked ? (
                <BookmarkIcon onClick={bookmarkPostHandler} />
              ) : (
                <BookmarkBorderIcon onClick={bookmarkPostHandler} />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostPreview;
