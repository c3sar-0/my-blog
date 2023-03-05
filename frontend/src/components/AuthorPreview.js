import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

const AuthorPreview = ({ author }) => {
  let descriptionSlice = author.description.slice(0, 100);
  if (descriptionSlice.length >= 30) {
    descriptionSlice += "...";
  }

  return (
    <div className="author-preview">
      <div className="author-preview__top">
        <div className="author-preview__img">
          <ProfilePicture profile_picture_url={author.profile_picture_url} />
        </div>
        <p>{author.name}</p>
      </div>
      <div className="author-preview__bottom">
        <p className="author-preview__joined">Joined on {author.created}.</p>
        <p>
          {descriptionSlice}
          {descriptionSlice.length >= 30 ? (
            <div className="author-preview__see-more">
              <Link to={`/user/${author.slug}`}>See more.</Link>
            </div>
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthorPreview;
