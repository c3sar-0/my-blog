import apiRequest from "../utils/apiRequest";
import React, { useState, Suspense } from "react";
import {
  defer,
  redirect,
  useLoaderData,
  Await,
  useParams,
} from "react-router-dom";
import AuthorPreview from "../components/AuthorPreview";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import PostDetail from "../components/PostDetail";

const Post = () => {
  const { post, comments: loaderComments } = useLoaderData();
  const [comments, setComments] = useState(null);
  const { id: postId } = useParams();

  const updateComments = async () => {
    const updated_comments = await apiRequest(
      process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments/`
    );
    setComments(updated_comments);
  };

  const commentSubmitHandler = async (text) => {
    // MAYBE RETURN COMMENTS ON THE BACKEND WHEN POSTING A COMMENT AND UPDATE A COMMENTS STATE HERE
    const data = await apiRequest(
      process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments/`,
      "POST",
      true,
      JSON.stringify({ text: text }),
      "application/json"
    );

    updateComments();
  };

  return (
    <>
      <div className="post-page">
        <section className="post-page__post-section">
          <Suspense fallback={<p>Loading post...</p>}>
            <Await resolve={post}>
              {(data) => {
                return <PostDetail post={data} />;
              }}
            </Await>
          </Suspense>
        </section>
        <section className="post-page__author-section">
          <Suspense fallback={<p>Loading post...</p>}>
            <Await resolve={post}>
              {(data) => {
                return <AuthorPreview author={data.author} />;
              }}
            </Await>
          </Suspense>
        </section>
        <section className="post-page__comment-section">
          <div className="post-page__comments-header">Comments</div>
          <CommentForm
            submitHandler={commentSubmitHandler}
            placeholder="Add a new comment..."
            btnText="Comment"
          />
          <Suspense fallback={<p>Loading comments...</p>}>
            <Await resolve={loaderComments}>
              {(data) => {
                return (
                  <CommentList
                    comments={comments || data}
                    postId={postId}
                    updateCommentsHandler={updateComments}
                  />
                );
              }}
            </Await>
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default Post;

async function postLoader(postId) {
  const data = await apiRequest(
    process.env.REACT_APP_API_URL + `blog/posts/${postId}`
  );
  return data;
}

async function postCommentsLoader(postId) {
  const data = await apiRequest(
    process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments`
  );
  return data;
}

export async function loader({ request, params }) {
  const postId = params.id;

  return defer({
    post: postLoader(postId),
    comments: postCommentsLoader(postId),
  });
}

export async function action({ request, params }) {
  /**
   * Action for deleting posts.
   */
  await apiRequest(
    `${process.env.REACT_APP_API_URL}blog/posts/${params.id}`,
    "DELETE"
  );
  return redirect("/");
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
