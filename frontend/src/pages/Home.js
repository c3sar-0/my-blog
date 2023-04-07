import apiRequest from "../utils/apiRequest";
import React, { Suspense, useEffect, useState } from "react";
import {
  defer,
  NavLink,
  useLoaderData,
  Await,
  useSearchParams,
  useFetcher,
} from "react-router-dom";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";

const Home = () => {
  // const { posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const ordering = searchParams.get("ordering");

  const fetcher = useFetcher();
  const posts = useLoaderData();
  // const posts = fetcher.data;
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 2;

  const [page, setPage] = useState(1);
  console.log(page);

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/?index");
    }

    // scrollTop / clientHeight > page => setPage page++
    const scrollListener = () => {
      if (
        document.documentElement.scrollTop /
          document.documentElement.clientHeight >=
        page / 2
      ) {
        setPage((prev) => prev++);
      }
    };

    window.addEventListener("scroll", scrollListener);

    // cleanup
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [fetcher]);

  // window.onscroll = () => {
  //   if (!hasMore || !fetcher.state === "idle") return;
  //   if (
  //     document.documentElement.scrollHeight -
  //       document.documentElement.scrollTop ===
  //     document.documentElement.clientHeight
  //   ) {
  //     console.log("a");
  //     loadPosts();
  //   }
  // };

  return (
    <div className="home">
      <div className="home__sidebar">
        <Sidebar />
      </div>
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
        {/* <Suspense fallback={<p>Loading posts...</p>}>
          <Await resolve={posts}>
            {(posts) => {
              return <PostsList posts={posts} />;
            }}
          </Await>
        </Suspense> */}
        {fetcher.data ? <PostsList posts={posts} /> : <p>LOADING...</p>}
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

export async function loader({ request, params }) {
  const queryParams = new URL(request.url).searchParams;
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
