import apiRequest from "../utils/apiRequest";
import React, { useState } from "react";
import { useActionData, redirect, useSubmit } from "react-router-dom";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";

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
    <>
      <div className="new-post__sidebar">
        <Sidebar />
      </div>
      <div className="new-post">
        <Editor onSave={saveHandler} />
      </div>
    </>
  );
};

export default NewPost;

export async function action({ request, params }) {
  // Action for creating new post.
  const formData = await request.formData();
  console.log("FORM DATA: ", formData);

  const data = await apiRequest(
    process.env.REACT_APP_API_URL + "blog/posts/",
    "POST",
    true,
    formData
  );
  return redirect(`/posts/${data.id}`);
}
