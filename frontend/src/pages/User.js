import React, { Suspense, useState } from "react";
import { useLoaderData, defer, Await, useParams } from "react-router-dom";

import apiRequest from "../utils/apiRequest";

import UserDetail from "../components/UserDetail";
import PostsList from "../components/PostsList";
import Wall from "../components/Wall";
import Sidebar from "../components/Sidebar";

const User = () => {
  const { user, posts, wallComments } = useLoaderData();
  const { slug: userSlug } = useParams();
  const [comments, setComments] = useState(null);

  const updateComments = async () => {
    const updated_comments = await apiRequest(
      process.env.REACT_APP_API_URL + `user/users/${userSlug}/comments/`
    );
    setComments(updated_comments);
  };

  return (
    <div className="user-page">
      <div className="user-page__sidebar">
        <Sidebar />
      </div>
      <Suspense fallback={<p>Loading user...</p>}>
        <Await resolve={user}>
          {(user) => {
            return (
              <>
                <div className="user-page__left">
                  <section className="user-page__user-section">
                    <UserDetail user={user} />
                  </section>
                  <section className="user-page__wall-section">
                    <div className="user-page__wall-container">
                      <Suspense fallback={<p>Loading user's wall...</p>}>
                        <Await resolve={wallComments}>
                          {(data) => {
                            return (
                              <Wall
                                username={user.name}
                                userSlug={user.slug}
                                wallComments={comments || data}
                                updateCommentsHandler={updateComments}
                              />
                            );
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
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default User;

async function loadUser(userSlug) {
  const data = apiRequest(
    process.env.REACT_APP_API_URL + `user/users/${userSlug}/`,
    "GET",
    false
  );
  return data;
}

async function loadPosts(userSlug) {
  const data = apiRequest(
    process.env.REACT_APP_API_URL + `blog/posts?user=${userSlug}`
  );
  return data;
}

async function loadWall(userSlug) {
  const data = apiRequest(
    process.env.REACT_APP_API_URL + `user/users/${userSlug}/comments`
  );
  return data;
}

export async function loader({ request, params }) {
  return defer({
    user: loadUser(params.slug),
    posts: loadPosts(params.slug),
    wallComments: loadWall(params.slug),
  });
}
