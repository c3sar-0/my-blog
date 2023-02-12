import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import PostForm from "../components/PostForm";
import Editor from "../components/Editor";

const EditPost = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const post = useLoaderData();
  const errors = useActionData();

  useEffect(() => {
    if (!localStorage.access) {
      navigate("/auth?mode=login");
    }

    if (authCtx.user && post.author.name !== authCtx.user.name) {
      navigate("/");
    }
  }, [authCtx.user]);

  return (
    <>
      <Editor method="PUT" data={post} />
      {/* <PostForm
        button="Save"
        action={`/posts/${post.id}/edit`}
        title={post.title}
        text={post.text}
        errors={errors}
      /> */}
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
    `${process.env.REACT_APP_API_URL}blog/posts/${postId}/`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.access,
      },
    }
  );

  if (!response.ok && response.status === 400) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return redirect("/posts/" + postId);
}
