import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [profileInfo, SetProfileInfo] = useState({});
  useEffect(() => {
    let route = `/api/users/${localStorage.getItem("id")}/posts`;
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
    <div className="profile">
      {/* Header */}

      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      <div className="profile-box"></div>

      {/* Profile posts */}
      <Feed posts={posts} showModal={props.showModal} />
    </div>
  );
}

export default Profile;
