import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Post from "./Post";
import SearchIcon from "@mui/icons-material/Search";

function Widgets() {
  const [posts, setPosts] = useState([]);
  // useEffect(() => {
  //   async function fetchPosts() {
  //     // todo: from trending
  //     const response = await fetch("http://localhost:5000/api/user");
  //     const fetchedData = await response.json();
  //     setPosts(fetchedData);
  //   }
  //   fetchPosts();
  // }, []);
  return (
    <div className="widgets">
      <div className="widgets-input">
        <SearchIcon />
        <input placeholder="Search Pettr" type="text"></input>
      </div>
      <div className="widget-container">
        <h2>Trending</h2>
        {posts.map((post) => (
          <Post
            key={post._id}
            displayName={post.displayName}
            userName={post.userName}
            verified={post.verified}
            text={post.text}
            avatar={post.avatar}
            image={post.image}
            trendingView={false}
          />
        ))}
      </div>
    </div>
  );
}

export default Widgets;
