import React, { useEffect, useState } from "react";
import "../styles/Feed.css";
import PostBox from "./PostBox";
import Post from "./Post";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      // todo from following and myself
      const response = await fetch(
        `http://localhost:5000/api/user/${localStorage.getItem("token")}/feed`
      );
      const fetchedData = await response.json();
      setPosts(fetchedData);
    }
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      {/* Header */}

      <div className="feed-header">
        <h2>Home</h2>
      </div>

      {/* Post Box */}
      <PostBox />

      {posts.map((post) => (
        <Post
          key={post._id}
          user={post.user}
          text={post.content}
          image={post.image}
          trendingView={false}
        />
      ))}
    </div>
  );
}

export default Feed;
