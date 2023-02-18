import React from "react";
import { json, NavLink, useLoaderData } from "react-router-dom";
import PostsList from "../components/PostsList";
import Sidebar from "../components/Sidebar";

import WhatshotIcon from "@mui/icons-material/Whatshot";

const Home = () => {
  const posts = useLoaderData();

  return (
    <div className="home">
      <div className="home__sidebar">
        <Sidebar />
      </div>
      <div className="home__posts-list">
        <div>
          <nav>
            <NavLink to="#">🕒 Latest</NavLink>
            <NavLink to="#">🔥 Hot</NavLink>
            <NavLink to="#">🔝 Top</NavLink>
          </nav>
          <PostsList posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default Home;

export async function loader({ request, params }) {
  const response = await fetch(process.env.REACT_APP_API_URL + "blog/posts/", {
    ...(localStorage.access && {
      headers: { Authorization: "Bearer " + localStorage.access },
    }),
  });

  if (!response.ok) {
    throw json({ message: response.statusText }, { status: response.status });
  }

  return response;
}
