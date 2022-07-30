import React, { useState, useRef } from "react";
import Feed from "./Feed";
import "../styles/Timeline.css";
import "../styles/Explore.css";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
import SearchBar from "./SearchBar";
function Explore() {
  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString());
  const [page, setPage] = useState(1);
  const { isLoading, results, hasNextPage, setIsLoading } = usePagination(
    page,
    startedBrowsing,
    "posts",
    `/api/posts/explore`,
    {},
    []
  );
  const explore = useRef();

  const onScroll = () => {
    if (explore.current) {
      const { scrollTop, scrollHeight, clientHeight } = explore.current;
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div onScroll={onScroll} className="explore" ref={explore}>
      {" "}
      <div className="header">
        {/* Header */}
        Explore
      </div>
      <div className="explore-searchbar">
        <SearchBar />
      </div>
      <Feed
        posts={results}
      />
      {!isLoading && !hasNextPage && <div>You've reached the end!</div>}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Explore;
