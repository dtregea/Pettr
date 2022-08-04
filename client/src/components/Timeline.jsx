import React, { useState, useRef } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";
import useAuth from "../hooks/useAuth";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
import useAddPost from "../hooks/useAddPost";
function Timeline() {
  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString());
  const { auth } = useAuth();
  const [page, setPage] = useState(1);
  const { isLoading, results, hasNextPage, setIsLoading, deleteResult } = usePagination(
    page,
    startedBrowsing,
    "posts",
    `/api/users/${auth?.userId}/timeline`,
    {},
    []
  );
  const timeline = useRef();
  const { addedPosts, addPost, removeAddedPost } = useAddPost();

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

  function deletePost(_id) {
    removeAddedPost(_id);
    deleteResult(_id);
  }

  return (
    <div className="timeline" onScroll={onScroll} ref={timeline}>
      <div className="header">
        Home
      </div>

      <PostBox addPost={addPost} />

      <Feed
        addedPosts={addedPosts}
        posts={results}
        deletePost={deletePost}
      />
      {!isLoading && !hasNextPage && (
        <div>You've reached the end, follow people for more content!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Timeline;
