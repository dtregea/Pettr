import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Feed from "./Feed";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SearchBar from "./SearchBar";
function Widgets(props) {
  const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      try {
        const response = await axiosPrivate.get("/api/posts/trending", {
          signal: controller.signal,
        });
        if (response?.data?.status === "success") {
          isMounted && setPosts(response?.data?.data?.posts);
        }
      } catch (error) {
        if (!error.message === "canceled") {
          console.error(error);
        }
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="widgets">
      <SearchBar setSearchTab={props.setSearchTab} />
      <div className="widget-container">
        <h2>Trending</h2>
        <Feed
          posts={posts}
        />
      </div>
    </div>
  );
}

export default Widgets;
