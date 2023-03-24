import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

const AuthorHeader = ({ author, date }) => {
  //** Author header used above post titles and comments */

  return (
    <>
      <Link to={`/user/${author.slug}`}>
        <div className="author-header">
          <div className="author-header__img-container">
            <ProfilePicture profile_picture_url={author.profile_picture_url} />
          </div>
          <div className="author-header__info-container">
            <p className="author-header__name">{author.name}</p>
            <p className="author-header__date">
              {new Date(date).toDateString()}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default AuthorHeader;
