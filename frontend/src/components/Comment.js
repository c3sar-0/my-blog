import React, { useContext } from "react";
import { Form } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Comment = (props) => {
  const authCtx = useContext(AuthContext);

  // USAR STATE Y FETCH ACA, NO ACTIONS

  return (
    <>
      <h3>{props.author.name}</h3>
      <p>{props.text}</p>
      {authCtx.user && authCtx.user.name === props.author.name && (
        <Form method="DELETE">
          <button type="submit" name="intent" value="delete-comment">
            Delete
          </button>
        </Form>
      )}
    </>
  );
};

export default Comment;
