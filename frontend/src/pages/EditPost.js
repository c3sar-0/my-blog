import React from "react";
import { json, redirect, useLoaderData, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";

const EditPost = () => {
  const params = useParams();
  const post = useLoaderData();
  return (
    <>
      <PostForm
        button="Save"
        action={`/posts/${post.id}/edit`}
        title={post.title}
        text={post.text}
      />
    </>
  );
};

export default EditPost;

export async function action({ request, params }) {
  // Action for editing post.
  const postId = params.id;
  const formData = await request.formData();
  const body = {
    title: formData.get("title"),
    text: formData.get("text"),
  };

  const response = await fetch(
    `http://localhost:8000/api/blog/posts/${postId}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return redirect("/posts/" + postId);
}
