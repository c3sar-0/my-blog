import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";

import AuthorHeader from "./AuthorHeader";
import PostActions from "./PostActions";

const PostPreview = forwardRef(({ post }, ref) => {
  // const post = props.post;

  // const postPreviewRef = useRef();

  // useEffect(() => {
  //   if (!post.image_url) {
  //     postPreviewRef.current.style["min-height"] = "0";
  //   }
  // }, []);

  return (
    <article className="post-preview" ref={ref}>
      {post.image_url && (
        <div className="post-preview__img-container-wrapper">
          <div className="post-preview__img-container">
            <img
              src={post.image_url}
              alt="Post"
              className="post-preview__img"
            />
          </div>
        </div>
      )}
      <div
        className={`post-preview__content ${
          post.image_url ? "" : "post-preview__content--horizontal"
        }`}
      >
        <AuthorHeader author={post.author} date={post.created} />
        <div className="post-preview__title-container">
          <Link to={`/posts/${post.id}`} className="post-preview__title">
            <p>{post.title.toUpperCase()}</p>
          </Link>
        </div>
        <div className="post-preview__info">
          <ul className="post-preview__tags">
            {post.tags.map((tag) => (
              <li key={tag.id}>
                <Link to={`/?tag=${tag.text}`}>{tag.text}</Link>
              </li>
            ))}
          </ul>
          <PostActions post={post} />
        </div>
      </div>
    </article>
  );
});

export default PostPreview;
