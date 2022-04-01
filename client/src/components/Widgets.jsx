import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Post from "./Post";
import SearchIcon from "@mui/icons-material/Search";

function Widgets(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      console.log("fetching");
      const response = await fetch("http://localhost:5000/api/posts/trending", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const fetchedData = await response.json();
      if (fetchedData) {
        console.log(fetchedData);
        if (fetchedData.status === "success") setPosts(fetchedData.data.posts);
      }
    }
    fetchPosts();
  }, []);

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
            _id={post._id}
            user={post.user}
            text={post.content}
            image={post.image}
            trendingView={post.trendingView}
            timestamp={post.createdAt}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            repostCount={post.repostCount}
            isLiked={post.isLiked}
            isReposted={post.isReposted}
            showPostModal={props.showPostModal}
          />
        ))}
      </div>
    </div>
  );
}

export default Widgets;
