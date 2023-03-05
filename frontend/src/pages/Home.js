import React, { Suspense } from "react";
import {
  defer,
  json,
  NavLink,
  useLoaderData,
  Await,
  useSearchParams,
} from "react-router-dom";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const { posts, tags } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const ordering = searchParams.get("ordering");

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
            <NavLink to="/?ordering=created">
              <p
                className={`home__order ${
                  ordering === "created" || !ordering
                    ? "home__order--active"
                    : ""
                }`}
              >
                🕒 Latest
              </p>
            </NavLink>
            <NavLink to="/?ordering=likes">
              <p
                className={`home__order ${
                  ordering === "likes" ? "home__order--active" : ""
                }`}
              >
                🔝 Top
              </p>
            </NavLink>
            <NavLink to="/?ordering=comments">
              <p
                className={`home__order ${
                  ordering === "comments" ? "home__order--active" : ""
                }`}
              >
                🔥 Hot
              </p>
            </NavLink>
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
  const queryParams = new URL(requestUrl).searchParams;
  const tag = queryParams.get("tag");
  const search = queryParams.get("search");
  const ordering = queryParams.get("ordering");

  let url = process.env.REACT_APP_API_URL + "blog/posts";
  if (tag) {
    url += `?tags=${tag}`;
  }
  if (search) {
    url += `?search=${search}`;
  }
  if (ordering) {
    url += `?ordering=${ordering}`;
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
