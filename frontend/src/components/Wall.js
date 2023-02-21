import React from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Wall = ({ user }) => {
  const submitHandler = async (text) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `user/users/${user.id}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.access,
        },
        body: JSON.stringify({ text: text }),
      }
    );
  };

  return (
    <div className="wall">
      <div className="wall__form">
        <CommentForm
          placeholder={`Write on ${user.name}'s wall!`}
          btnText="Submit"
          submitHandler={submitHandler}
        />
      </div>
      <div className="wall__comments">
        <CommentList comments={user.wall_comments} userId={user.id} />
      </div>
    </div>
  );
};

export default Wall;
