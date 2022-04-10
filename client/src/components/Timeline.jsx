import React, { useEffect, useState, useRef } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";

function Timeline(props) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const timeline = useRef();

  async function fetchPosts() {
    let route = `/api/users/${localStorage.getItem("id")}/timeline`;
    const response = await fetch(
      `http://localhost:5000${route}?${new URLSearchParams({
        page: page,
      })}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.status == 200) {
      const fetchedData = await response.json();
      if (fetchedData) {
        setPosts([...posts, ...fetchedData.data.posts]);
        setEndReached(fetchedData.data.posts.length < 15 ? true : false);
      }
    } else if (response.status == 204) {
      setEndReached(true);
    }
  }
  useEffect(() => {
    fetchPosts();
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
