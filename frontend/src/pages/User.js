import React, { Suspense, useState } from "react";
import { useLoaderData, defer, Await, useParams } from "react-router-dom";

import apiRequest from "../utils/apiRequest";

import UserDetail from "../components/UserDetail";
import PostsList from "../components/PostsList";
import Wall from "../components/Wall";
import Sidebar from "../components/Sidebar";

import useInifinitePostScroll from "../hooks/useInfinitePostScroll";

const User = () => {
  const { user, wallComments } = useLoaderData();
  const { slug: userSlug } = useParams();
  const [comments, setComments] = useState(null);

  console.log(user);

  const [lastPostRef, isFetchingNextPage, data, status, error] =
    useInifinitePostScroll(
      `${process.env.REACT_APP_API_URL}blog/posts/?user=${userSlug}`
    );

  const updateComments = async () => {
    const updated_comments = await apiRequest(
      process.env.REACT_APP_API_URL + `user/users/${userSlug}/comments/`
    );
    setComments(updated_comments);
  };

  return (
    <div className="user-page">
      <div className="user-page__left">
        <div className="user-page__sidebar">
          <Sidebar />
        </div>
        <section className="user-page__user-section">
          <UserDetail user={user} />
        </section>
        <section className="user-page__wall-section">
          <div className="user-page__wall-container">
            <Wall
              username={user.name}
              userSlug={user.slug}
              wallComments={comments || wallComments}
              updateCommentsHandler={updateComments}
            />
          </div>
        </section>
      </div>
      <section className="user-page__posts-section">
        {data ? (
          <PostsList pages={data.pages} ref={lastPostRef} />
        ) : (
          <p>Loading...</p>
        )}
        {isFetchingNextPage && <p>Loading posts...</p>}
      </section>
    </div>
  );
};

export default User;

export async function loader({ request, params }) {
  const wallData = await apiRequest(
    process.env.REACT_APP_API_URL + `user/users/${params.slug}/comments`
  );

  const userData = await apiRequest(
    process.env.REACT_APP_API_URL + `user/users/${params.slug}/`,
    "GET",
    false
  );

  return { user: userData, wallComments: wallData };
}
