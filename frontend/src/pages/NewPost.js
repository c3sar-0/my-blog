import React, { useState } from "react";
import { json, useActionData, redirect, useSubmit } from "react-router-dom";
import Editor from "../components/Editor";

import Tiptap from "../components/TipTap/TipTap";

const NewPost = () => {
  const errors = useActionData();
  const [data, setData] = useState();
  const submit = useSubmit();

  const saveHandler = async ({ image_url, text, title, tags }) => {
    const formData = new FormData();
    if (image_url) {
      formData.append("image_url", image_url);
    }
    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", tags);

    submit(formData, {
      action: `/posts/new/`,
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="new-post">
      <Editor onSave={saveHandler} />
      {/* <Tiptap /> */}
    </div>
  );
};

export default NewPost;

export async function action({ request, params }) {
  // Action for creating new post.
  const formData = await request.formData();
  console.log("FORM DATA: ", formData);

  const response = await fetch(process.env.REACT_APP_API_URL + "blog/posts/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + String(localStorage.access),
    },
    body: formData,
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
