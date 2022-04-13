import React, { useEffect, useState, useRef } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function Timeline(props) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const timeline = useRef();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      try {
        let route = `/api/users/${auth?.userId}/timeline?${new URLSearchParams({
          page: page,
        })}`;
        const response = await axiosPrivate.get(
          `http://localhost:5000${route}`,
          {
            signal: controller.signal,
          }
        );
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
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
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
        setPage(page + 1);
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
    </div>
  );
}

export default Timeline;
