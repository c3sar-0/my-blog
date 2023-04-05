import React, { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useSubmit, Link } from "react-router-dom";

import Output from "editorjs-react-renderer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthorHeader from "./AuthorHeader";

import PostActions from "./PostActions";

const PostDetail = (props) => {
  const authCtx = useContext(AuthContext);
  const post = props.post;
  const submit = useSubmit();
  const actionsBoxRef = useRef();

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

  const toggleActionsHandler = () => {
    actionsBoxRef.current.classList.toggle(
      "post-detail__owner-actions--hidden"
    );
  };

  return (
    <div className="post-detail">
      {post.author.name == authCtx.user?.name && (
        <div
          className="post-detail__owner-actions post-detail__owner-actions--hidden"
          ref={actionsBoxRef}
        >
          <button
            className="post-detail__toggle-actions-btn"
            onClick={toggleActionsHandler}
          >
            <MoreVertIcon />
          </button>
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
        <AuthorHeader author={post.author} date={post.created} />
        <h1 className="post-detail__title">{post.title}</h1>
        <div className="post-detail__tags">
          {post.tags.map((tag) => (
            <Link to={`/?tag=${tag.text}`} key={tag.id}>
              {tag.text}
            </Link>
          ))}
        </div>
      </div>
      <div className="post-detail__text">
        <Output data={data} />
      </div>
      <div className="post-detail__actions">
        <PostActions post={post} />
      </div>
    </div>
  );
};

export default PostDetail;
