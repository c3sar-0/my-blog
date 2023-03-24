import apiRequest from "../utils/apiRequest";
import React, { Suspense } from "react";
import {
  defer,
  NavLink,
  useLoaderData,
  Await,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const { posts, tags } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const ordering = searchParams.get("ordering");
  const { showSidebar } = useOutletContext();

  return (
    <div className="home">
      <>
        <div
          className={`home__overlay ${
            showSidebar ? "home__overlay--visible" : "home__overlay--hidden"
          }`}
        ></div>
        <div
          className={`home__sidebar ${
            showSidebar ? "home__sidebar--visible" : "home__sidebar--hidden"
          }`}
        >
          <Suspense fallback={<p>Loading sidebar...</p>}>
            <Await resolve={tags}>{(tags) => <Sidebar tags={tags} />}</Await>
          </Suspense>
        </div>
      </>
      <div className="home__posts-list">
        <nav>
          <NavLink
            to={`/?${
              (searchParams.get("search") &&
                `search=${searchParams.get("search")}&`) ||
              ""
            }${
              (searchParams.get("tag") && `tag=${searchParams.get("tag")}&`) ||
              ""
            }ordering=created`}
          >
            <p
              className={`home__order ${
                ordering === "created" || !ordering ? "home__order--active" : ""
              }`}
            >
              🕒 Latest
            </p>
          </NavLink>
          <NavLink
            to={`/?${
              (searchParams.get("search") &&
                `search=${searchParams.get("search")}&`) ||
              ""
            }${
              (searchParams.get("tag") && `tag=${searchParams.get("tag")}&`) ||
              ""
            }ordering=likes`}
          >
            <p
              className={`home__order ${
                ordering === "likes" ? "home__order--active" : ""
              }`}
            >
              🔝 Top
            </p>
          </NavLink>
          <NavLink
            to={`/?${
              (searchParams.get("search") &&
                `search=${searchParams.get("search")}&`) ||
              ""
            }${
              (searchParams.get("tag") && `tag=${searchParams.get("tag")}&`) ||
              ""
            }ordering=comments`}
          >
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
            {(posts) => {
              return <PostsList posts={posts} />;
            }}
          </Await>
        </Suspense>
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

  let reqParams = [];
  if (tag) {
    reqParams.push(`tags=${tag}`);
  }
  if (search) {
    reqParams.push(`search=${search}`);
  }
  if (ordering) {
    reqParams.push(`ordering=${ordering}`);
  }
  const url = `${process.env.REACT_APP_API_URL}blog/posts?${reqParams.join(
    "&"
  )}`;

  const data = await apiRequest(url);
  return data;
}

async function tagsLoader() {
  const data = await apiRequest(process.env.REACT_APP_API_URL + "blog/tags");
  return data;
}

export async function loader({ request, params }) {
  return defer({
    posts: postsLoader(request.url),
    tags: tagsLoader(),
  });
}
