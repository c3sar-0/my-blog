import apiRequest from "../utils/apiRequest";
import React, { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";
import CommentForm from "./CommentForm";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AuthorHeader from "./AuthorHeader";

const Comment = ({ comment, postId, userSlug, updateCommentsHandler }) => {
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

    await apiRequest(url, "DELETE");

    updateCommentsHandler();
  };

  const editSubmitHandler = async (text) => {
    const data = await apiRequest(
      url,
      "PUT",
      true,
      JSON.stringify({ text: text }),
      "application/json"
    );

    updateCommentsHandler();
    setIsEditing(false);
  };

  const likeCommentHandler = async () => {
    let method = "POST";
    if (isLiked) {
      method = "DELETE";
    }
    const data = await apiRequest(url + "like/", method, true);

    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
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
            <AuthorHeader author={comment.author} date={comment.created} />
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
