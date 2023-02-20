import React from "react";
import { json, useLoaderData } from "react-router-dom";

import UserDetail from "../components/UserDetail";
import PostsList from "../components/PostsList";

const User = () => {
  const data = useLoaderData();
  console.log(data);
  return (
    <div className="user-page">
      <section className="user-page__user-section">
        <UserDetail />
      </section>
      <section className="user-page__posts-section">POSTS</section>
    </div>
  );
};

export default User;

export async function loader({ request, params }) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `user/${params.slug}/`
  );
  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }
  return response;
}
