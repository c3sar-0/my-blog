import React from "react";
import Comment from "./Comment";

const CommentList = ({ comments, postId, userSlug, updateCommentsHandler }) => {
  return (
    <>
      {comments.results.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            userSlug={userSlug}
            updateCommentsHandler={updateCommentsHandler}
          />
        );
      })}
    </>
  );
};

export default CommentList;
