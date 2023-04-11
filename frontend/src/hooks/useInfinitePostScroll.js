import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { useLocation } from "react-router-dom";

const fetchPosts = async ({ pageParam = 1, meta }) => {
  const data = await apiRequest(
    // `http://localhost:8000/api/blog/posts/?page=${pageParam}`
    meta.url.concat(`&page=${pageParam}`)
  );
  return data;
};

// NOW I NEED THIS TO WORK WHEN CHANGING URL. ALSO USE THIS HOOK ON USER, BOOKMARKS, ETC...

const useInfinitePostScroll = (url) => {
  const location = useLocation();
  const [hasMounted, setHasMounted] = useState(false);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    meta: { url: url },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next === null ? undefined : allPages.length + 1;
    },
  });

  // the intObserver is a ref just because it is a good way to do it (more safe)
  const intObserver = useRef();

  // if you pass a callback as a ref, it'll be executed when the target mounts/unmounts
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (posts) => {
          if (posts[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // useEffect(() => {
  //   if (!hasMounted) {
  //     setHasMounted(true);
  //     return;
  //   }
  //   console.log("changed location");
  //   fetchNextPage({ pageParam: 1 });
  // }, [location]);

  return [lastPostRef, isFetchingNextPage, data, status, error];
};

export default useInfinitePostScroll;
