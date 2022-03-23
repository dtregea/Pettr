import React, { useEffect, useState } from "react";
import "../styles/Feed.css";
import PostBox from "./PostBox";
import Post from "./Post";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      console.log("fetching");
      const response = await fetch(
        `http://localhost:5000/api/users/${localStorage.getItem("id")}/feed`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        setPosts(fetchedData.data.posts);
      }
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
          key={post.id}
          user={post.user}
          text={post.text}
          image={post.image}
          trendingView={post.trendingView}
          timestamp={post.createdAt}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          repostCount={post.repostCount}
        />
      ))}
    </div>
  );
}

export default Feed;
