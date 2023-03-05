import React, { Suspense } from "react";
import { defer, json, NavLink, useLoaderData, Await } from "react-router-dom";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const { posts, tags } = useLoaderData();

  return (
    <div className="home">
      <div className="home__sidebar">
        <Suspense fallback={<p>Loading sidebar...</p>}>
          <Await resolve={tags}>{(tags) => <Sidebar tags={tags} />}</Await>
        </Suspense>
      </div>
      <div className="home__posts-list">
        <div>
          <nav>
            <NavLink to="#">🕒 Latest</NavLink>
            <NavLink to="#">🔥 Hot</NavLink>
            <NavLink to="#">🔝 Top</NavLink>
          </nav>
          <Suspense fallback={<p>Loading posts...</p>}>
            <Await resolve={posts}>
              {(posts) => <PostsList posts={posts} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Home;

async function postsLoader(requestUrl) {
  const searchParams = new URL(requestUrl).searchParams;
  const tag = searchParams.get("tag");

  let url = process.env.REACT_APP_API_URL + "blog/posts";
  if (tag) {
    url += `?tags=${tag}`;
  }

  const response = await fetch(url, {
    ...(localStorage.access && {
      headers: { Authorization: "Bearer " + localStorage.access },
    }),
  });

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  const data = await response.json();
  return data;
}

async function tagsLoader() {
  const response = await fetch(process.env.REACT_APP_API_URL + "blog/tags");

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  const data = await response.json();
  return data;
}

export async function loader({ request, params }) {
  return defer({
    posts: postsLoader(request.url),
    tags: tagsLoader(),
  });
}
