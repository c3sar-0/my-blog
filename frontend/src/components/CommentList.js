import React from "react";
import Comment from "./Comment";

const CommentList = ({ comments, postId }) => {
  return (
    <>
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} postId={postId} />;
      })}
    </>
  );
};

export default CommentList;
