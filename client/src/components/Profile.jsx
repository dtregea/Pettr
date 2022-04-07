import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar } from "@mui/material";
function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    async function fetchUserInfo() {
      const response = await fetch(
        `http://localhost:5000/api/users/${localStorage.getItem("id")}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        console.log(fetchedData.data.user);
        setUserInfo(fetchedData.data.user);
      }
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        `http://localhost:5000/api/users/${localStorage.getItem("id")}/posts`,
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
    <div className="profile">
      {/* Header */}

      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      <div className="profile-box">
        {userInfo.avatar && (
          <div className="profile-avatar">
            <Avatar
              sx={{ height: "70px", width: "70px" }}
              src={userInfo.avatar}
            />
          </div>
        )}

        <div className="profile-info">
          <div className="profile-names">
            <div className="profile-name">{userInfo.displayname}</div>
            <span>@{userInfo.username}</span>
          </div>
          <ul className="profile-numbers">
            <li className="profile-details">
              <span className="profile-label">Tweets</span>
              <span className="profile-number">0</span>
            </li>
            <li className="profile-details">
              <span className="profile-label">Following</span>
              <span className="profile-number">0</span>
            </li>
            <li className="profile-details">
              <span className="profile-label">Followers</span>
              <span className="profile-number">0</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile posts */}
      <Feed posts={posts} showModal={props.showModal} />
    </div>
  );
}

export default Profile;
