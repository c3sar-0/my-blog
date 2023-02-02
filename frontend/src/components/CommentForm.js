import React, { useContext, useRef } from "react";
import { json } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CommentForm = (props) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    props.onSubmit(textRef.current.value);
  };

  return (
    <>
      {props.error && <p>{props.error}</p>}
      <form onSubmit={submitHandler}>
        <input
          name="text"
          placeholder={authCtx.isLoggedIn ? "Comment..." : "Log in to comment."}
          ref={textRef}
        />
        <button
          name="intent"
          value="comment"
          disabled={authCtx.isLoggedIn ? false : true}
        >
          Comment
        </button>
      </form>
    </>
  );
};

export default CommentForm;

export async function action({ request, params }) {
  /**
   * Action for creating comments.
   */
  const postId = params.id;
  const formData = await request.formData();
  const response = await fetch(
    process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.access,
      },
      body: JSON.stringify({
        text: formData.get("text"),
      }),
    }
  );
  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }
  return response;
}
