import apiRequest from "../utils/apiRequest";
import React, { Suspense, useEffect, useState, useRef } from "react";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const ordering = searchParams.get("ordering");

  const fetcher = useFetcher();
  const postsListRef = useRef();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);

    const data = await apiRequest(
      process.env.REACT_APP_API_URL + `blog/posts/?page=${page}`
    );
    console.log(data);
    setPosts((prev) => (prev ? [...prev, ...data.results] : data.results));
    const dataHasMore = data.next === null ? false : true;
    // if (dataHasMore) {
    //   setPage((prev) => prev + 1);
    // }
    setHasMore(dataHasMore);
    setLoading(false);
  };

  useEffect(() => {
    if (hasMounted) {
      fetchPosts();
    } else {
      setHasMounted(true);
    }
  }, [hasMounted, page]);

  const handleScroll = () => {
    if (!hasMore) return;

    if (
      postsListRef.current &&
      document.documentElement.clientHeight +
        document.documentElement.scrollTop >=
        postsListRef.current.offsetHeight
    ) {
      // fetchPosts();
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!hasMore) return;

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, hasMore]);

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

        {posts ? (
          <PostsList posts={posts} ref={postsListRef} />
        ) : (
          <p>LOADING...</p>
        )}
        {loading && <p>Loading more...</p>}
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
