import React, { useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";

import apiRequest from "../utils/apiRequest";

const PostActions = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked_by_user);
  const [likes, setLikes] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked_by_user);

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

  return (
    <div className="post-actions">
      <div className="post-actions__comments">
        <CommentIcon />
        <p>{post.comments}</p>
      </div>
      <div className="post-actions__likes">
        {isLiked ? (
          <FavoriteIcon
            className="post-actions__favourite-btn--active"
            onClick={likePostHandler}
          />
        ) : (
          <FavoriteBorderIcon
            className="post-actions__favourite-btn"
            onClick={likePostHandler}
          />
        )}
        <p>{likes}</p>
      </div>
      <div className="post-actions__bookmark">
        {isBookmarked ? (
          <BookmarkIcon onClick={bookmarkPostHandler} />
        ) : (
          <BookmarkBorderIcon onClick={bookmarkPostHandler} />
        )}
      </div>
    </div>
  );
};

export default PostActions;
