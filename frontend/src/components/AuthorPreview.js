import React from "react";

const AuthorPreview = ({ author }) => {
  return (
    <div className="author-preview">
      <div className="author-preview__img">
        <img src={author.profile_picture_url} alt="profile picture" />
      </div>
      <p>{author.name}</p>
    </div>
  );
};

export default AuthorPreview;
