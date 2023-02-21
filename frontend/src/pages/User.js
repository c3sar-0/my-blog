import React, { Suspense } from "react";
import { json, useLoaderData, defer, Await } from "react-router-dom";

import UserDetail from "../components/UserDetail";
import PostsList from "../components/PostsList";
import Wall from "../components/Wall";

const User = () => {
  const { user, posts } = useLoaderData();

  return (
    <div className="user-page">
      <div className="user-page__left">
        <section className="user-page__user-section">
          <Suspense fallback={<p>Loading user...</p>}>
            <Await resolve={user}>
              {(loadedUser) => {
                return <UserDetail user={loadedUser} />;
              }}
            </Await>
          </Suspense>
        </section>
        <section className="user-page__wall-section">
          <div className="user-page__wall-container">
            <Suspense fallback={<p>Loading user's wall...</p>}>
              <Await resolve={user}>
                {(loadedUser) => {
                  return <Wall user={loadedUser} />;
                }}
              </Await>
            </Suspense>
          </div>
        </section>
      </div>
      <section className="user-page__posts-section">
        <Suspense fallback={<p>Loading user's posts....</p>}>
          <Await resolve={posts}>
            {(loadedPosts) => {
              return <PostsList posts={loadedPosts} />;
            }}
          </Await>
        </Suspense>
      </section>
    </div>
  );
};

export default User;

async function loadUser(userSlug) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `user/users/${userSlug}/`
  );
  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }
  const data = await response.json();
  return data;
}

async function loadPosts(userSlug) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `blog/posts?user=${userSlug}`
  );
  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }
  const data = await response.json();
  return data;
}

export async function loader({ request, params }) {
  return defer({
    user: loadUser(params.slug),
    posts: loadPosts(params.slug),
  });
}
