import React, { useContext, useRef, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";
import CommentForm from "./CommentForm";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Comment = ({ comment, postId, userSlug }) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();
  const btnContainerRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.is_liked_by_user);
  const [likes, setLikes] = useState(comment.likes);

  let url = process.env.REACT_APP_API_URL;
  if (postId) {
    url = url + `blog/posts/${postId}/comments/${comment.id}/`;
  } else if (!postId && userSlug) {
    url = url + `user/users/${userSlug}/comments/${comment.id}/`;
  }

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete the comment?")) return;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.access,
      },
    });

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }
    textRef.current.value = "deleted";
  };

  const editSubmitHandler = async (text) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.access,
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    if (!response.ok) {
      console.log(response);
      return;
    }
  };

  const likeCommentHandler = async () => {
    let method = "POST";
    if (isLiked) {
      method = "DELETE";
    }
    const response = await fetch(url + "like/", {
      method: method,
      headers: {
        Authorization: "Bearer " + localStorage.access,
      },
    });

    if (!response.ok) {
      console.log(response);
      return;
    }
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev--);
    } else {
      setIsLiked(true);
      setLikes((prev) => Number(prev) + 1);
    }
  };

  const toggleMenuHandler = () => {
    btnContainerRef.current.classList.toggle("comment__btn-container--hidden");
    btnContainerRef.current.classList.toggle("comment__btn-container--visible");
  };
  return (
    <>
      <div className="comment">
        <div className="comment__favourite-container">
          {!isLiked ? (
            <FavoriteBorderIcon
              className="comment__favourite"
              onClick={likeCommentHandler}
            />
          ) : (
            <FavoriteIcon
              onClick={likeCommentHandler}
              className="comment__favourite comment__favourite--active"
            />
          )}
          <p className="comment__likes-number">{likes}</p>
        </div>
        {!isEditing && (
          <>
            <div className="comment__author">
              <div className="post-preview__author-img-container">
                <ProfilePicture
                  profile_picture_url={comment.author.profile_picture_url}
                />
              </div>
              <div>
                <p className="comment__author-name">{comment.author.name}</p>
                <p className="comment__date">
                  {new Date(comment.created).toDateString()}
                </p>
              </div>
            </div>
            <div className="comment__content">
              <p ref={textRef}>{comment.text}</p>
            </div>
            {authCtx.user && authCtx.user.name === comment.author.name && (
              <div className="comment__actions">
                <MoreVertIcon onClick={toggleMenuHandler} />
                <div
                  className="comment__btn-container comment__btn-container--hidden"
                  ref={btnContainerRef}
                >
                  <div className="comment__action-btn">
                    <button
                      className="account-btn comment__edit-btn"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="comment__action-btn">
                    <button
                      onClick={deleteHandler}
                      className="account-btn account-btn--red comment__delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {isEditing && (
          <CommentForm
            submitHandler={editSubmitHandler}
            defaultValue={comment.text}
            btnText="Save"
            cancelHandler={() => {
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Comment;
