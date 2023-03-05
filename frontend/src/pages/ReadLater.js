import React, { Suspense } from "react";
import { defer, json, Await, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ReadLater = () => {
  const { tags } = useLoaderData();

  return (
    <div className="read-later">
      <Suspense fallback={<p>Loading tags...</p>}>
        <Await resolve={tags}>{(tags) => <Sidebar tags={tags} />}</Await>
      </Suspense>
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

async function postsLoader() {}

export async function loader({ request, params }) {
  // load tags for sidebar (i'll change this later to be dry)
  return defer({
    tags: tagsLoader(),
  });
}
