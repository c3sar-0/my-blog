import React from "react";
import CommentForm from "./CommentForm";

const Wall = ({ user }) => {
  return (
    <div className="wall">
      <div className="wall__form">
        <CommentForm
          placeholder={`Write on ${user.name}'s wall!`}
          btnText="Submit"
        />
      </div>
      <div className="wall__comments">
        HERE GO THE USER'S WALL COMMENTS (GOTTA IMPLEMENT THAT ON THE BACKEND)
      </div>
    </div>
  );
};

export default Wall;
