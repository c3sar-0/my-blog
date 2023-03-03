import React from "react";
import { Form } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";

const EditUserForm = ({ user, data }) => {
  const errors = data?.errors;

  return (
    // <div className="user-detail">
    <Form
      className="user-form"
      method="patch"
      action={`/user/${user?.slug}/edit/`}
      encType="multipart/form-data"
    >
      <div className="user-detail__img-container user-form__pp-container u-margin-bottom-medium">
        <label className="user-form__pp-label" htmlFor="user-form-pp">
          Change picture...
        </label>
        <input
          type="file"
          id="user-form-pp"
          name="profile_picture_url"
          hidden
        />
        <ProfilePicture profile_picture_url={user?.profile_picture_url} />
      </div>
      {errors?.name && <p>{errors.name}</p>}
      <label htmlFor="user-form-name">Username</label>
      <input
        className="user-form__username"
        type="text"
        id="user-form-name"
        name="name"
        defaultValue={user?.name}
        placeholder="Change username..."
      />
      <p className="user-detail__date-joined">
        Joined on {new Date(user?.created).toDateString()}
      </p>
      <div className="user-form__decription-container">
        {/* <h4 className="user-detail__description">{user?.description}</h4> */}
        <label htmlFor="user-form-desc">Description</label>
        <textarea
          className="user-form__description"
          id="user-form-desc"
          name="description"
          defaultValue={user?.description || ""}
          placeholder="Change description..."
        />
      </div>
      <div className="user-detail__info">
        <div className="user-detail__posts-info">
          <ArticleIcon />
          <p className="user-detail__num-posts">
            Posts published: {user?.number_of_posts}
          </p>
        </div>
        <div className="user-detail__comments-info">
          <CommentIcon />
          <p className="user-detail__num-comments">
            Comments made: {user?.number_of_comments}
          </p>
        </div>
      </div>
      <button className="account-btn">Save</button>
    </Form>
  );
};

export default EditUserForm;
