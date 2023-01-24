import React from "react";
import { json, useLoaderData } from "react-router-dom";
import PostsList from "../components/PostsList";

const Posts = () => {
  const data = useLoaderData();

  return <PostsList posts={data} />;
};

export default Posts;

export async function loader({ request, params }) {
  const response = await fetch("http://localhost:8000/api/blog/posts/");

  if (!response.ok) {
    // console.log(response);
    // return {};
    throw json({ message: response.statusText }, { status: response.status });
  }

  return response;
}
