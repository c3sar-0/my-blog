import React, { useEffect } from "react";
import { json, useActionData, redirect } from "react-router-dom";
import PostForm from "../components/PostForm";

const NewPost = () => {
  const errors = useActionData();

  return (
    <>
      <PostForm button="Create" action="/posts/new" errors={errors} />
    </>
  );
};

export default NewPost;

export async function action({ request, params }) {
  // Action for creating new post.
  const formData = await request.formData();

  const body = {
    title: formData.get("title"),
    text: formData.get("text"),
  };

  const response = await fetch(process.env.REACT_APP_API_URL + "blog/posts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(localStorage.access),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok && response.status === 400) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  const data = await response.json();

  return redirect(`/posts/${data.id}`);
}
