import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import Editor from "../components/Editor";
import { apiRequest } from "../utils/apiRequest";

const EditPost = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const post = useLoaderData();
  const errors = useActionData();
  const submit = useSubmit();

  useEffect(() => {
    if (!localStorage.access) {
      navigate("/auth?mode=login");
    }

    if (authCtx.user && post.author.name !== authCtx.user.name) {
      navigate("/");
    }
  }, [authCtx.user]);

  const saveHandler = async ({ image_url, text, title, tags }) => {
    const formData = new FormData();
    if (image_url) {
      formData.append("image_url", image_url);
    }
    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", tags);
    submit(formData, {
      action: `/posts/${post.id}/edit/`,
      method: "PUT",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="edit-post">
      <Editor onSave={saveHandler} data={post} />
    </div>
  );
};

export default EditPost;

export async function action({ request, params }) {
  // Action for editing post.

  const postId = params.id;
  const formData = await request.formData();

  await apiRequest(
    `${process.env.REACT_APP_API_URL}blog/posts/${postId}/`,
    "PUT",
    true,
    formData.get("image_url")
      ? formData
      : JSON.stringify(Object.fromEntries(formData))
  );

  // const response = await fetch(
  //   `${process.env.REACT_APP_API_URL}blog/posts/${postId}/`,
  //   {
  //     method: "PUT",
  //     headers: {
  //       ...(!formData.get("image_url") && {
  //         "Content-Type": "application/json",
  //       }),
  //       Authorization: "Bearer " + localStorage.access,
  //     },
  //     body: formData.get("image_url")
  //       ? formData
  //       : JSON.stringify(Object.fromEntries(formData)),
  //     // body: JSON.stringify({
  //     //   ...Object.fromEntries(formData),
  //     //   tags: formData.get("tags").split(","),
  //     // }),
  //   }
  // );

  // if (!response.ok && response.status === 400) {
  //   return response;
  // }

  // if (!response.ok) {
  //   throw json({ message: response.statusText }, { status: response.status });
  // }

  return redirect("/");
  // return redirect("/posts/" + postId);
}
