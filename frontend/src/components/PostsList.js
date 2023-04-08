import React, { forwardRef } from "react";
import PostPreview from "./PostPreview";

const PostsList = forwardRef(({ posts }, ref) => {
  return (
    <ul className="posts-list__list" ref={ref}>
      {posts.map((post) => (
        <PostPreview post={post} key={post.id} />
      ))}
    </ul>
  );
});

export default PostsList;
