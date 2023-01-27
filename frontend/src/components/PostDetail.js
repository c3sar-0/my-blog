import React from "react";
import { useNavigate, useSubmit } from "react-router-dom";

const PostDetail = (props) => {
  const post = props.post;
  const submit = useSubmit();
  const navigate = useNavigate();

  const deletePostHandler = () => {
    submit(null, { method: "DELETE" });
  };

  const editPostHandler = () => {
    navigate("edit");
  };

  return (
    <>
      <h1>
        {post.title} - {post.author?.name} (
        {new Date(post.created).toLocaleDateString()})
      </h1>
      <p>{post.text}</p>
      <button onClick={deletePostHandler}>Delete</button>
      <button onClick={editPostHandler}>Edit</button>
    </>
  );
};

export default PostDetail;
