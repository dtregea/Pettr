import React, { useEffect, useState } from "react";
import "../styles/Widgets.css";
import "../styles/Post.css";
import Feed from "./Feed";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Widgets(props) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

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
        navigate("/login", { state: { from: location }, replace: true });
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
