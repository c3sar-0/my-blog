import React, { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

const CommentForm = ({ postId }) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await fetch(
      process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.access,
        },
        body: JSON.stringify({
          text: textRef.current.value,
        }),
      }
    );
  };

  return (
    <>
      <form onSubmit={submitHandler} className="comment-form">
        <textarea
          name="text"
          placeholder={
            authCtx.isLoggedIn ? "Add a comment..." : "Log in to comment."
          }
          ref={textRef}
          className="comment-form__textarea"
          minLength="1"
          maxLength="500"
        />
        <button
          name="intent"
          value="comment"
          disabled={authCtx.isLoggedIn ? false : true}
          className="account-btn comment-form__submit-btn"
        >
          Comment
        </button>
      </form>
    </>
  );
};

export default CommentForm;

// export async function action({ request, params }) {
//   /**
//    * Action for creating comments.
//    */
//   const postId = params.id;
//   const formData = await request.formData();
//   const response = await fetch(
//     process.env.REACT_APP_API_URL + `blog/posts/${postId}/comments/`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: localStorage.access,
//       },
//       body: {},
//       // body: JSON.stringify({
//       //   text: formData.get("text"),
//       // }),
//     }
//   );
//   if (!response.ok) {
//     throw json({ message: response.statusText }, { status: response.status });
//   }
//   return response;
// }
