import React from "react";

const PostPreview = (props) => {
  const post = props.post;
  return (
    <section className="post-preview">
      <div className="post-preview__img-container">
        <img src={post.image_url} />
      </div>
      <div className="post-preview__content">
        <div className="post-preview__content--author">
          {post.author.name} - {new Date(post.created).toDateString()}
        </div>
        <div className="post-preview__content--title">
          <h2>{post.title.toUpperCase()}</h2>
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
