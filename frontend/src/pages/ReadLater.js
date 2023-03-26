import React, { Suspense } from "react";
import {
  defer,
  Await,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PostsList from "../components/PostsList";
import apiRequest from "../utils/apiRequest";

const ReadLater = () => {
  const { tags, bookmarks } = useLoaderData();

  return (
    <div className="read-later">
      <div className="read-later__sidebar">
        <Suspense fallback={<p>Loading tags...</p>}>
          <Await resolve={tags}>{(tags) => <Sidebar tags={tags} />}</Await>
        </Suspense>
      </div>
      <div className="read-later__post-list">
        <div className="read-later__header">
          <p>Bookmarks</p>
        </div>
        <Suspense fallback={<p>Loading bookmarks...</p>}>
          <Await resolve={bookmarks}>
            {(posts) => {
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
  const data = await apiRequest(
    process.env.REACT_APP_API_URL + "blog/tags",
    "GET",
    false
  );
  return data;
}

async function bookmarksLoader() {
  const data = await apiRequest(
    process.env.REACT_APP_API_URL + "blog/bookmarks"
  );
  return data;
}

export async function loader({ request, params }) {
  // load tags for sidebar (i'll change this later to be dry)
  return defer({
    tags: tagsLoader(),
    bookmarks: bookmarksLoader(),
  });
}
