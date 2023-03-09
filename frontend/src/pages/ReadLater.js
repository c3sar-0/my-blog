import React, { Suspense } from "react";
import { defer, json, Await, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PostsList from "../components/PostsList";

const ReadLater = () => {
  const { tags, bookmarks } = useLoaderData();

  return (
    <div className="read-later">
      <Suspense fallback={<p>Loading tags...</p>}>
        <Await resolve={tags}>{(tags) => <Sidebar tags={tags} />}</Await>
      </Suspense>
      <div className="read-later__post-list">
        <div className="read-later__header">
          <p>Bookmarks</p>
        </div>
        <Suspense fallback={<p>Loading bookmarks...</p>}>
          <Await resolve={bookmarks}>
            {(posts) => {
              console.log(posts);
              return <PostsList posts={posts} />;
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default ReadLater;

async function tagsLoader() {
  const response = await fetch(process.env.REACT_APP_API_URL + "blog/tags");

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  const data = await response.json();
  return data;
}

async function bookmarksLoader() {
  const response = await fetch(
    process.env.REACT_APP_API_URL + "blog/bookmarks",
    {
      headers: {
        Authorization: "Bearer " + localStorage.access,
      },
    }
  );

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  const data = await response.json();
  return data;
}

export async function loader({ request, params }) {
  // load tags for sidebar (i'll change this later to be dry)
  return defer({
    tags: tagsLoader(),
    bookmarks: bookmarksLoader(),
  });
}
