import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Feed from "./Feed";
import SearchIcon from "@mui/icons-material/Search";

function Widgets(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("http://localhost:5000/api/posts/trending", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const fetchedData = await response.json();
      if (fetchedData) {
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
        <Feed
          posts={posts}
          showModal={props.showModal}
          setProfileTab={props.setProfileTab}
        />
      </div>
    </div>
  );
}

export default Widgets;
