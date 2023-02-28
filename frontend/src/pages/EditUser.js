import React from "react";

const EditUser = () => {
  return (
    <div className="edit-user">
      <form>
        <input type="file" placeholder="Change profile picture..." />
        <input type="text" placeholder="Change username" />
        <input type="text" placeholder="Change description" />
      </form>
    </div>
  );
};

export default EditUser;
