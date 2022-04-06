import React, { useEffect, useState } from "react";
import "../styles/Timeline.css";
import PostBox from "./PostBox";
import Feed from "./Feed";

function Timeline(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
  }, [props.isPostModal]);

  return (
    <div className="timeline">
      {/* Header */}

      <div className="timeline-header">
        <h2>Home</h2>
      </div>

      {/* Post Box */}
      {!props.isPostModal && <PostBox />}

      {/* Feed */}
      <Feed posts={posts} showModal={props.showModal} />
    </div>
  );
}

export default Timeline;
