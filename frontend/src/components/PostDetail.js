import React from "react";

const PostDetail = (props) => {
  const post = props.post;

  return (
    <>
      <h1>
        {post.title} - {post.author} ({post.created})
      </h1>
      <p>{post.text}</p>
    </>
  );
};

export default PostDetail;
