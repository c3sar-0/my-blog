import React from "react";

import { Link } from "react-router-dom";

const PostsList = (props) => {
  const posts = props.posts;
  console.log(posts);

  return (
    <>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <Link to={`${post.id}`}>
                <h2>
                  {post.title} - {post.author.name}
                </h2>
                <p>{post.text.slice(0, 20)}...</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PostsList;
