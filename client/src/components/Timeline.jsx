import React, { useState, useRef } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";
import useAuth from "../hooks/useAuth";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
function Timeline(props) {
  const { auth } = useAuth();
  const [startedBrowsing, setStartedBrowsing] = useState(
    new Date().toISOString()
  );
  const [page, setPage] = useState(1);
  const { isLoading, results, hasNextPage, setIsLoading } = usePagination(
    page,
    startedBrowsing,
    "posts",
    `/api/users/${auth?.userId}/timeline`,
    {},
    []
  );
  const timeline = useRef();

  const onScroll = () => {
    if (timeline.current) {
      const { scrollTop, scrollHeight, clientHeight } = timeline.current;
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div className="timeline" onScroll={onScroll} ref={timeline}>
      <div className="header">
        {/* Header */}
        Home
      </div>

      {/* Post Box */}
      <PostBox />

      {/* Feed */}
      <Feed
        posts={results}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />
      {!isLoading && !hasNextPage && (
        <div>You've reached the end, follow people for more content!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Timeline;
