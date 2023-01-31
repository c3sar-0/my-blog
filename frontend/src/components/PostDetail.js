import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useSubmit } from "react-router-dom";

const PostDetail = (props) => {
  const authCtx = useContext(AuthContext);
  const post = props.post;
  const submit = useSubmit();
  const navigate = useNavigate();

  const deletePostHandler = () => {
    submit(null, { method: "DELETE" });
  };
  const editPostHandler = () => {
    navigate("edit");
  };

  console.log(post);

  return (
    <>
      <h1>
        {post.title} - {post.author?.name} (
        {new Date(post.created).toLocaleDateString()})
      </h1>
      <p>{post.text}</p>
      {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
        <button onClick={deletePostHandler}>Delete</button>
      )}
      {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
        <button onClick={editPostHandler}>Edit</button>
      )}
      <ul>
        {post.comments.map((comment) => {
          return (
            <li key={comment.id}>
              <h3>{comment.author.name}</h3>
              <p>{comment.text}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PostDetail;
