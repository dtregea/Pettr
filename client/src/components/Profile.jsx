import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar, Button } from "@mui/material";
function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [userJSON, setUserJSON] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [followedByUser, setFollowedByUser] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const profile = useRef();

  async function fetchPosts() {
    const response = await fetch(
      `http://localhost:5000/api/users/${
        props.userId
      }/posts?${new URLSearchParams({
        page: page,
      })}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.status == 200) {
      const fetchedData = await response.json();
      if (fetchedData) {
        setPosts([...posts, ...fetchedData.data.posts]);
        setEndReached(fetchedData.data.posts.length < 15 ? true : false);
      }
    } else if (response.status == 204) {
      setEndReached(true);
    }
  }

  useLayoutEffect(() => {
    async function fetchUserInfo() {
      const response = await fetch(
        `http://localhost:5000/api/users/${props.userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData.status === "success") {
        setUserJSON(fetchedData.data.user);
        setUserCounts(fetchedData.data.counts);
        setFollowedByUser(fetchedData.data.followedByUser);
      }
    }
    fetchUserInfo();
  }, [props.userId, followedByUser]);

  useLayoutEffect(() => {
    setUserId(props.userId);
    return () => {
      setPosts([]);
    };
  }, [props.userId]);

  // User Id is a state so this will only run on render AND when the cleanup
  // function above runs. Otherwise posts from the last profile viewed will show
  // if a user clicks a profile picture while viewing another profile
  // "It just works"
  useLayoutEffect(() => {
    fetchPosts();
  }, [userId, page]);

  async function toggleFollow() {
    let method = followedByUser ? "DELETE" : "POST";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/follow?${new URLSearchParams({
          follower: localStorage.getItem("id"),
          followed: userJSON._id,
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
  const onScroll = () => {
    if (profile.current) {
      const { scrollTop, scrollHeight, clientHeight } = profile.current;
      if (scrollTop + clientHeight === scrollHeight && !endReached) {
        setPage(page + 1);
      }
    }
  };

  return (
    <div className="profile" onScroll={onScroll} ref={profile}>
      {/* Header */}

      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      {userJSON.avatar && (
        <div className="profile-box">
          <div className="profile-avatar">
            <Avatar
              sx={{ height: "70px", width: "70px" }}
              src={userJSON.avatar}
            />
          </div>
          <div className="profile-info">
            <div className="profile-names">
              <div className="profile-name">
                {userJSON.displayname}
                <span>@{userJSON.username}</span>
              </div>

              <div>
                {userJSON._id != localStorage.getItem("id") && (
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
      {endReached && (
        <div>You've reached the end, follow people for more content!</div>
      )}
    </div>
  );
}

export default Profile;
