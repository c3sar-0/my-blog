import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Comment = (props) => {
  const authCtx = useContext(AuthContext);
  const authorRef = useRef();
  const textRef = useRef();
  const navigate = useNavigate();

  const deleteHandler = async () => {
    const res = await fetch(
      process.env.REACT_APP_API_URL +
        `blog/posts/${props.postId}/comments/${props.commentId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.access,
        },
      }
    );
    authorRef.current.value = "deleted";
    textRef.current.value = "deleted";
    navigate("");
    // IN POST DETAIL CREATE A STATE WITH INITIAL VALUE = PROPS.COMMENTS AND DELETE THIS ONE
  };

  return (
    <>
      <h3 ref={authorRef}>{props.author.name}</h3>
      <p ref={textRef}>{props.text}</p>
      {authCtx.user && authCtx.user.name === props.author.name && (
        <button onClick={deleteHandler}>Delete</button>
      )}
    </>
  );
};

export default Comment;
