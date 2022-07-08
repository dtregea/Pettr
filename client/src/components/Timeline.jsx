import React, { useEffect, useState, useRef } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PageLoading from "./PageLoading";

function Timeline(props) {
  const [startedBrowsing, setStartedBrowsing] = useState(
    new Date().toISOString()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const timeline = useRef();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      isMounted && setIsLoading(true);
      try {
        let route = `/api/users/${auth?.userId}/timeline?${new URLSearchParams({
          page: page,
          firstPostTime: startedBrowsing,
        })}`;
        const response = await axiosPrivate.get(`${route}`, {
          signal: controller.signal,
        });
        if (response.status == 200) {
          isMounted && setPosts([...posts, ...response?.data?.data?.posts]);
          isMounted &&
            setEndReached(
              response?.data?.data?.posts?.length < 15 ? true : false
            );
        } else if (response.status == 204) {
          setEndReached(true);
        }
      } catch (error) {
        if (!error.message === "canceled") {
          console.error(error);
        }
      }
      isMounted && setIsLoading(false);
    }
    fetchPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page]);

  const onScroll = () => {
    if (timeline.current) {
      const { scrollTop, scrollHeight, clientHeight } = timeline.current;
      if (scrollTop + clientHeight === scrollHeight && !endReached) {
        if (!isLoading) {
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div className="timeline" onScroll={onScroll} ref={timeline}>
      <div className="timeline-header">
        {/* Header */}
        <h2>Home</h2>
      </div>

      {/* Post Box */}
      <PostBox />

      {/* Feed */}
      <Feed
        posts={posts}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />
      {endReached && (
        <div>You've reached the end, follow people for more content!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Timeline;
