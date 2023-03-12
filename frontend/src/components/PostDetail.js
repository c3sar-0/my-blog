import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useSubmit, Link } from "react-router-dom";

import Output from "editorjs-react-renderer";

const PostDetail = (props) => {
  const authCtx = useContext(AuthContext);
  const post = props.post;
  const submit = useSubmit();
  // const navigate = useNavigate();

  let data;
  try {
    data = JSON.parse(post.text);
  } catch {
    data = "";
  }

  const deletePostHandler = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    submit(null, { method: "DELETE" });
  };

  return (
    <div className="post-detail">
      {post.author.name == authCtx.user?.name && (
        <div className="post-detail__owner-actions">
          <button
            onClick={deletePostHandler}
            className="account-btn account-btn--red post-detail__delete-btn"
          >
            Delete
          </button>
          <Link to="edit" className="account-btn post-detail__edit-btn">
            Edit post
          </Link>
        </div>
      )}
      {post.image_url && (
        <div className="post-detail__image">
          <img src={post.image_url} alt="Post" />
        </div>
      )}
      <div className="post-detail__info">
        <h1>{post.title}</h1>
      </div>
      <div className="post-detail__text">
        <Output data={data} />
      </div>
    </div>
  );
};

export default PostDetail;

// <h1>
//   {post.title} - {post.author?.name} (
//   {new Date(post.created).toLocaleDateString()})
// </h1>
// <img src={post.image_url} alt="post image" style={{ height: "300px" }} />
// <button>{post.is_liked_by_user ? "Already liked" : "Like"}</button>
// <p>{post.text}</p>
// {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
//   <button onClick={deletePostHandler}>Delete</button>
// )}
// {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
//   <button onClick={editPostHandler}>Edit</button>
// )}
// <CommentForm
//   postId={post.id}
//   onSubmit={commentSubmitHandler}
//   error={commentFormError}
// />
// <ul>
//   {post.comments.map((comment) => {
//     return (
//       <li key={comment.id}>
//         <Comment
//           author={comment.author}
//           text={comment.text}
//           postId={post.id}
//           commentId={comment.id}
//         />
//       </li>
//     );
//   })}
// </ul>
