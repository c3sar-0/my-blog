import React, { useContext } from "react";
import { Form } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CommentForm = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <Form method="POST">
      <input
        name="text"
        placeholder={authCtx.isLoggedIn ? "Comment..." : "Log in to comment."}
      />
      <button
        type="submit"
        name="intent"
        value="comment"
        disabled={authCtx.isLoggedIn ? false : true}
      >
        Comment
      </button>
    </Form>
  );
};

export default CommentForm;
