import React, { useEffect, useState, useLayoutEffect } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";

function Timeline(props) {
  const [posts, setPosts] = useState([]);

  useLayoutEffect(() => {
    let route = `/api/users/${localStorage.getItem("id")}/timeline`;
    async function fetchPosts() {
      const response = await fetch(`http://localhost:5000${route}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const fetchedData = await response.json();
      if (fetchedData) {
        setPosts(fetchedData.data.posts);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="timeline">
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
    </div>
  );
}

export default Timeline;
