import React, { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";

const Comment = ({ comment, postId }) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete the comment?")) return;
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

  return (
    <>
      <div className="comment">
        <div className="comment__author">
          <div className="comment__author-img-container">
            <ProfilePicture
              profile_picture_url={comment.author.profile_picture_url}
            />
          </div>
          <div className="comment__author-name">{comment.author.name}</div>
        </div>
        <div className="comment__content">
          <p ref={textRef}>{comment.text}</p>
        </div>
        {authCtx.user && authCtx.user.name === comment.author.name && (
          <button onClick={deleteHandler}>Delete</button>
        )}
      </div>
    </>
  );
};

export default Comment;
