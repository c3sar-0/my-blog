import React from "react";
import { json, redirect, useLoaderData } from "react-router-dom";
import PostDetail from "../components/PostDetail";

const Post = () => {
  const data = useLoaderData();

  return (
    <>
      <PostDetail post={data} />
    </>
  );
};

export default Post;

export async function loader({ request, params }) {
  const postId = params.id;

  const response = await fetch(
    `http://localhost:8000/api/blog/posts/${postId}`
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return response;
}

export async function action({ request, params }) {
  // Action for deleting post
  console.log("delete");
  const response = await fetch(
    `http://localhost:8000/api/blog/posts/${params.id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return redirect("/posts");
}
