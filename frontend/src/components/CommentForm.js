import React, { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";

const CommentForm = ({
  placeholder,
  submitHandler,
  defaultValue,
  btnText,
  cancelHandler,
}) => {
  const authCtx = useContext(AuthContext);
  const textRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    submitHandler(textRef.current.value);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="comment-form">
        <textarea
          name="text"
          placeholder={
            authCtx.isLoggedIn ? placeholder || "" : "Log in to comment."
          }
          ref={textRef}
          className="comment-form__textarea"
          minLength="1"
          maxLength="500"
          defaultValue={defaultValue ? defaultValue : ""}
        />
        <button
          name="intent"
          value="comment"
          disabled={authCtx.isLoggedIn ? false : true}
          className="account-btn comment-form__submit-btn"
        >
          {btnText}
        </button>
        {cancelHandler && (
          <button
            name="intent"
            disabled={authCtx.isLoggedIn ? false : true}
            className="account-btn account-btn--red comment-form__cancel-btn"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        )}
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
