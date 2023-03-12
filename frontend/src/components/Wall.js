import React from "react";
import { apiRequest } from "../utils/apiRequest";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Wall = ({ username, userSlug, wallComments, updateCommentsHandler }) => {
  const submitHandler = async (text) => {
    const data = await apiRequest(
      process.env.REACT_APP_API_URL + `user/users/${userSlug}/comments/`,
      "POST",
      true,
      JSON.stringify({ text: text }),
      "application/json"
    );

    updateCommentsHandler();
  };

  return (
    <div className="wall">
      <div className="wall__form">
        <CommentForm
          placeholder={`Write on ${username}'s wall!`}
          btnText="Submit"
          submitHandler={submitHandler}
        />
      </div>
      <div className="wall__comments">
        <CommentList
          comments={wallComments}
          userSlug={userSlug}
          updateCommentsHandler={updateCommentsHandler}
        />
      </div>
    </div>
  );
};

export default Wall;
