import React from "react";
import { Link } from "react-router-dom";
// import defaultPP from "../assets/defaultPP.png";
import defaultPP from "../assets/defaultPP2.webp";

const ProfilePicture = ({ onClick, profile_picture_url, border, bg }) => {
  return (
    <div
      className={`profile-picture ${border ? "profile-picture--border" : ""} ${
        bg ? "profile-picture--bg" : ""
      }`}
    >
      <img
        src={profile_picture_url ? profile_picture_url : defaultPP}
        alt="profile picture"
        onClick={onClick}
      />
    </div>
  );
};

export default ProfilePicture;
