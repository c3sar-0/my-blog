import React from "react";
import PostPreview from "./PostPreview";

const PostsList = (props) => {
  const posts = props.posts;

  return (
    <>
      <ul>
        {posts.map((post) => (
          <PostPreview post={post} key={post.id} />
        ))}
      </ul>
    </>
  );
};

export default PostsList;
