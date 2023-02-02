import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useSubmit } from "react-router-dom";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

const PostDetail = (props) => {
  const authCtx = useContext(AuthContext);
  const post = props.post;
  const submit = useSubmit();
  const navigate = useNavigate();
  const [commentFormError, setCommentFormError] = useState(null);

  const deletePostHandler = () => {
    submit(null, { method: "DELETE" });
  };
  const editPostHandler = () => {
    navigate("edit");
  };

  const commentSubmitHandler = async (text) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `blog/posts/${post.id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.access,
          },
          body: JSON.stringify({
            text: text,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setCommentFormError(data.text[0]);
      }
      navigate("");
    } catch (err) {
      setCommentFormError("Something went wrong.");
    }
  };
  console.log(post);

  return (
    <>
      <h1>
        {post.title} - {post.author?.name} (
        {new Date(post.created).toLocaleDateString()})
      </h1>
      <img src={post.image_url} alt="post image" style={{ height: "300px" }} />
      <button>{post.is_liked_by_user ? "Already liked" : "Like"}</button>
      <p>{post.text}</p>
      {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
        <button onClick={deletePostHandler}>Delete</button>
      )}
      {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
        <button onClick={editPostHandler}>Edit</button>
      )}
      <CommentForm
        postId={post.id}
        onSubmit={commentSubmitHandler}
        error={commentFormError}
      />
      <ul>
        {post.comments.map((comment) => {
          return (
            <li key={comment.id}>
              <Comment
                author={comment.author}
                text={comment.text}
                postId={post.id}
                commentId={comment.id}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PostDetail;
