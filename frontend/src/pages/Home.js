import apiRequest from "../utils/apiRequest";
import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
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

import useInfinitePostScroll from "../hooks/useInfinitePostScroll";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ordering = searchParams.get("ordering");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  let url = `${process.env.REACT_APP_API_URL}blog/posts/?`;
  if (ordering) url = url.concat(`&ordering=${ordering}`);
  if (search) url = url.concat(`&search=${search}`);
  if (tag) url = url.concat(`&tag=${tag}`);

  const [lastPostRef, isFetchingNextPage, data, status, error] =
    useInfinitePostScroll(url);

  if (status === "error")
    return <p className="center">Error: {error.message}</p>;

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

        {data ? (
          <PostsList pages={data.pages} ref={lastPostRef} />
        ) : (
          <p>LOADING...</p>
        )}
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
  );
};

export default Home;

export async function loader({ request, params }) {
  const queryParams = new URL(request.url).searchParams;
  const tag = queryParams.get("tag");
  const search = queryParams.get("search");
  const ordering = queryParams.get("ordering");
  const page = queryParams.get("page");

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
  if (page) {
    reqParams.push(`page=${page}`);
  }
  const url = `${process.env.REACT_APP_API_URL}blog/posts?${reqParams.join(
    "&"
  )}`;

  const data = await apiRequest(url);
  return data;
}
