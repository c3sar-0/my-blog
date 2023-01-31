import React from "react";
import { json, useLoaderData } from "react-router-dom";
import PostsList from "../components/PostsList";

const Posts = () => {
  const data = useLoaderData();

  return <PostsList posts={data} />;
};

export default Posts;

export async function loader({ request, params }) {
  const response = await fetch(process.env.REACT_APP_API_URL + "blog/posts/");

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return response;
}
