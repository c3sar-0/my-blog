import React from "react";
import { Link } from "react-router-dom";

const PostPreview = (props) => {
  const post = props.post;
  return (
    <section className="post-preview">
      <div className="post-preview__img-container">
        <img src={post.image_url} alt="Post" />
      </div>
      <div className="post-preview__content">
        <div className="post-preview__content--author">
          {post.author.name} - {new Date(post.created).toDateString()}
        </div>
        <div className="post-preview__content--title">
          <Link to={`/posts/${post.id}`}>
            <h2>{post.title.toUpperCase()}</h2>
          </Link>
        </div>
        <div className="post-preview__content--info">
          <div className="post-preview__content--info-tags">
            #insert #tags #here
          </div>
          <div className="post-preview__content--info-stats">
            <p>Comments</p>
            <p>Likes</p>
            <p>Save</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPreview;
