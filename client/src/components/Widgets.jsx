import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Feed from "./Feed";
import SearchIcon from "@mui/icons-material/Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Widgets(props) {
  const [posts, setPosts] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  async function search(event) {
    event.preventDefault();
    console.log("search");
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `http://localhost:5000/api/search?${new URLSearchParams({
          query: searchPhrase,
        })}`,
        {
          signal: controller.signal,
        }
      );
      if (response?.data?.status === "success") {
        console.log(response);
        props.setSearchTab(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      try {
        const response = await axiosPrivate.get(
          "http://localhost:5000/api/posts/trending",
          {
            signal: controller.signal,
          }
        );
        if (response?.data?.status === "success") {
          isMounted && setPosts(response?.data?.data?.posts);
        }
      } catch (error) {
        console.error(error);
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
      <div className="widgets-input">
        <SearchIcon />
        <form onSubmit={search}>
          <input
            value={searchPhrase}
            placeholder="Search Pettr"
            type="text"
            onChange={(e) => setSearchPhrase(e.target.value)}
          ></input>
        </form>
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
