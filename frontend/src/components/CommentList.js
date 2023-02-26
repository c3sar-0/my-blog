import React from "react";
import Comment from "./Comment";

const CommentList = ({ comments, postId, userSlug }) => {
  return (
    <>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            userSlug={userSlug}
          />
        );
      })}
    </>
  );
};

export default CommentList;
