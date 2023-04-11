import React, { forwardRef } from "react";
import PostPreview from "./PostPreview";

const PostsList = forwardRef(({ pages }, ref) => {
  return (
    <ul className="posts-list__list">
      {pages.map((pg) => {
        return pg.results.map((post, i) => {
          return pg.results.length === i + 1 && ref ? (
            <PostPreview post={post} key={post.id} ref={ref} />
          ) : (
            <PostPreview post={post} key={post.id} />
          );
        });
      })}
    </ul>
  );
});

export default PostsList;
