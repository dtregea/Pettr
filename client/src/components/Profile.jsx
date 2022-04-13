import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar, Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [userJSON, setUserJSON] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [followedByUser, setFollowedByUser] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useRef();
  const { auth } = useAuth();

  useLayoutEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchUserInfo() {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5000/api/users/${props.userId}`,
          {
            signal: controller.signal,
          }
        );
        if (response?.data?.status === "success") {
          isMounted && setUserJSON(response?.data?.data?.user);
          isMounted && setUserCounts(response?.data?.data?.counts);
          isMounted && setFollowedByUser(response?.data?.data?.followedByUser);
        }
      } catch (error) {
        if (!error.message === "Canceled") {
          console.error(error);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    }
    fetchUserInfo();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [props.userId, followedByUser]);

  useEffect(() => {
    setUserId(props.userId);
    return () => {
      setPage(1);
      setPosts([]);
    };
  }, [props.userId]);

  // User Id is a state so this will only run on render AND when the cleanup
  // function above runs. Otherwise posts from the last profile viewed will show
  // if a user clicks a profile picture while viewing another profile
  // "It just works"
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5000/api/users/${
            props.userId
          }/posts?${new URLSearchParams({
            page: page,
          })}`,
          {
            signal: controller.signal,
          }
        );
        if (response?.status === 200) {
          isMounted && setPosts([...posts, ...response?.data?.data?.posts]);
          isMounted &&
            setEndReached(
              response?.data?.data?.posts?.length < 15 ? true : false
            );
        } else if (response?.status == 204) {
          isMounted && setEndReached(true);
        }
      } catch (error) {
        if (!error.message === "canceled") {
          console.error(error);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, page]);

  async function toggleFollow() {
    let method = followedByUser ? "DELETE" : "POST";
    if (!waiting) {
      setWaiting(true);
      try {
        let response;
        if (method === "POST") {
          response = await axiosPrivate.post(
            `http://localhost:5000/api/follow?${new URLSearchParams({
              follower: auth?.userId,
              followed: userJSON._id,
            })}`
          );
        } else if (method === "DELETE") {
          response = await axiosPrivate.delete(
            `http://localhost:5000/api/follow?${new URLSearchParams({
              follower: auth?.userId,
              followed: userJSON._id,
            })}`
          );
        }
        if (response?.data?.status === "success") {
          setFollowedByUser(response?.data?.data?.isReposted);
        }
        setWaiting(false);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
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
                {userJSON._id != auth?.userId && (
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
