import React, { useState, useEffect, useLayoutEffect } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar, Button } from "@mui/material";
function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [followedByUser, setFollowedByUser] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      console.log(`http://localhost:5000/api/users/${props.user}`);
      const response = await fetch(
        `http://localhost:5000/api/users/${props.user}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      console.log(fetchedData);
      if (fetchedData.status === "success") {
        setUserInfo(fetchedData.data.user);
        setUserCounts(fetchedData.data.counts);
        setFollowedByUser(fetchedData.data.followedByUser);
      }
    }
    fetchUserInfo();
  }, [props.user, followedByUser]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        `http://localhost:5000/api/users/${props.user}/posts`,
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
  }, [props.user]);

  async function toggleFollow() {
    let method = followedByUser ? "DELETE" : "POST";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/follow?${new URLSearchParams({
          follower: localStorage.getItem("id"),
          followed: userInfo._id,
        })}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        console.log(fetchedData);
        if (fetchedData.status === "success") {
          setFollowedByUser(fetchedData.data.isReposted);
        }
        setWaiting(false);
      }
    }
  }

  return (
    <div className="profile">
      {/* Header */}

      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      {userInfo.avatar && (
        <div className="profile-box">
          <div className="profile-avatar">
            <Avatar
              sx={{ height: "70px", width: "70px" }}
              src={userInfo.avatar}
            />
          </div>
          <div className="profile-info">
            <div className="profile-names">
              <div className="profile-name">
                {userInfo.displayname}
                <span>@{userInfo.username}</span>
              </div>

              <div>
                {userInfo._id != localStorage.getItem("id") && (
                  <Button
                    variant="outlined"
                    className="profile-follow-button"
                    fullWidth
                    onClick={toggleFollow}
                  >
                    {followedByUser ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
            <ul className="profile-numbers">
              <li className="profile-details">
                <span className="profile-label">Tweets</span>
                <span className="profile-number">{userCounts.posts}</span>
              </li>
              <li className="profile-details">
                <span className="profile-label">Following</span>
                <span className="profile-number">{userCounts.following}</span>
              </li>
              <li className="profile-details">
                <span className="profile-label">Followers</span>
                <span className="profile-number">{userCounts.followers}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Profile posts */}
      <Feed
        posts={posts}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />
    </div>
  );
}

export default Profile;
