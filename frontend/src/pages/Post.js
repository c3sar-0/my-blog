import React, { useEffect } from "react";
import { json, redirect, useLoaderData } from "react-router-dom";
import AuthorPreview from "../components/AuthorPreview";
import PostDetail from "../components/PostDetail";

const Post = () => {
  const data = useLoaderData();
  console.log(data.author);
  return (
    <>
      <div className="post-page">
        <PostDetail post={data} />
        <AuthorPreview author={data.author} />
      </div>
    </>
  );
};

export default Post;

export async function loader({ request, params }) {
  const postId = params.id;

  const response = await fetch(
    `http://localhost:8000/api/blog/posts/${postId}`,
    localStorage.access
      ? { headers: { Authorization: "Bearer " + localStorage.access } }
      : {}
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return response;
}

export async function action({ request, params }) {
  /**
   * Action for deleting posts.
   */
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}blog/posts/${params.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.access,
      },
    }
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return redirect("/posts");
}

// COMMENT
// if (intent === "comment") {
//   const response = await fetch(
//     `${process.env.REACT_APP_API_URL}blog/posts/${params.id}/comments/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.access,
//       },
//       body: JSON.stringify({
//         text: formData.get("text"),
//       }),
//     }
//   );

//   if (!response.ok) {
//     return json(
//       { message: response.statusText },
//       { status: response.status }
//     );
//   }
//   return response;
// }

// // DELETE COMMENT
// if (intent === "delete-comment") {
//   const response = await fetch(
//     `${process.env.REACT_APP_API_URL}blog/posts/${params.id}/comments/${commentId}`,
//     {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.access,
//       },
//     }
//   );

//   if (!response.ok) {
//     return json(
//       { message: response.statusText },
//       { status: response.status }
//     );
//   }
//   return response;
// }
