import React, { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";

import MoreVertIcon from "@mui/icons-material/MoreVert";

const Comment = ({ comment, postId }) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();
  const btnContainerRef = useRef();

  // FOR EDIT FUNCTIONALLITY: ADD STATE ISEDITING
  // IF TRUE, RENDER A TEXTAREA INSTEAD OF THE COMMENT (OR JUST THE COMMENT FORM, DK)
  // ADD THE ICON FOR LIKING

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete the comment?")) return;
    const res = await fetch(
      process.env.REACT_APP_API_URL +
        `blog/posts/${postId}/comments/${comment.id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.access,
        },
      }
    );

    if (!res.ok) {
      console.log(res.statusText);
      return;
    }
    textRef.current.value = "deleted";
  };

  const toggleMenuHandler = () => {
    btnContainerRef.current.classList.toggle("comment__btn-container--hidden");
    btnContainerRef.current.classList.toggle("comment__btn-container--visible");
  };

  return (
    <>
      <div className="comment">
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
                <button className="account-btn comment__edit-btn">Edit</button>
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
      </div>
    </>
  );
};

export default Comment;
