import React from "react";
import Comment from "./Comment";

const CommentList = ({ comments, postId, userId }) => {
  return (
    <>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            userId={userId}
          />
        );
      })}
    </>
  );
};

export default CommentList;
