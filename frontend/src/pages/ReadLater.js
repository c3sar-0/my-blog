import React from "react";
import Sidebar from "../components/Sidebar";
import PostsList from "../components/PostsList";
import useInfinitePostScroll from "../hooks/useInfinitePostScroll";

const ReadLater = () => {
  const [lastPostRef, isFetchingNextPage, data, status, error] =
    useInfinitePostScroll(process.env.REACT_APP_API_URL + "blog/bookmarks");

  return (
    <div className="read-later">
      <div className="read-later__sidebar">
        <Sidebar />
      </div>
      <div className="read-later__post-list">
        <div className="read-later__header">
          <p>Bookmarks</p>
        </div>
        <PostsList pages={data.pages} ref={lastPostRef} />;
      </div>
    </div>
  );
};

export default ReadLater;
