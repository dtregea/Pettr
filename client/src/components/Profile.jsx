import React, { useState, useEffect, useRef } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar, Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UploadImage from "./UploadImage";
import PageLoading from "./PageLoading";
function Profile(props) {
  const [isLoading, setIsLoading] = useState(true); // Waiting for posts
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [userJSON, setUserJSON] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [waiting, setWaiting] = useState(false); // Waiting for profile updates
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [followedByUser, setFollowedByUser] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [startedBrowsing, setStartedBrowsing] = useState(
    new Date().toISOString()
  );
  const axiosPrivate = useAxiosPrivate();
  const profile = useRef();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchUserInfo() {
      try {
        const response = await axiosPrivate.get(`/api/users/${props.userId}`, {
          signal: controller.signal,
        });
        if (response?.data?.status === "success") {
          if (isMounted) {
            setUserJSON(response?.data?.data?.user);
            setUserCounts(response?.data?.data?.counts);
            setFollowedByUser(response?.data?.data?.followedByUser);
          }
        }
      } catch (error) {
        if (!error.message === "Canceled") {
          console.error(error);
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
    setStartedBrowsing(new Date().toISOString());
    setUserId(props.userId);
    return () => {
      setPage(1);
      setPosts([]);
    };
  }, [props.userId]);

  // User Id is a state so this will only run on render AND when the cleanup
  // function above runs. Otherwise posts from the last profile viewed will show
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchPosts() {
      isMounted && setIsLoading(true);
      try {
        const response = await axiosPrivate.get(
          `/api/users/${props.userId}/posts?${new URLSearchParams({
            page: page,
            firstPostTime: startedBrowsing,
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
        if (!error.message === "Canceled") {
          console.error(error);
        }
      }
      isMounted && setIsLoading(false);
    }
    fetchPosts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId, page]);

  // Only make changes on profile that occur on server
  useEffect(() => {
    setBio(userJSON.bio);
  }, [userJSON]);

  useEffect(() => {
    setProfilePicture(userJSON.avatar);
  }, [userJSON]);

  async function toggleFollow() {
    let isMounted = true;
    const controller = new AbortController();
    let method = followedByUser ? "DELETE" : "POST";
    if (!waiting) {
      isMounted && setWaiting(true);
      try {
        let response;
        if (method === "POST") {
          response = await axiosPrivate.post(
            `/api/follow?${new URLSearchParams({
              follower: auth?.userId,
              followed: userJSON._id,
            })}`
          );
        } else if (method === "DELETE") {
          response = await axiosPrivate.delete(
            `/api/follow?${new URLSearchParams({
              follower: auth?.userId,
              followed: userJSON._id,
            })}`
          );
        }
        if (response?.data?.status === "success") {
          setFollowedByUser(response?.data?.data?.isReposted);
        }
        isMounted && setWaiting(false);
      } catch (error) {
        console.error(error);
      }
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }
  const onScroll = () => {
    if (profile.current) {
      const { scrollTop, scrollHeight, clientHeight } = profile.current;
      if (scrollTop + clientHeight === scrollHeight && !endReached) {
        setPage(page + 1);
      }
    }
  };

  function toggleEditing() {
    setEditing(!editing);
  }

  async function updateProfile(event) {
    event.preventDefault();
    if (editing) {
      let formData = new FormData();
      formData.append("image", profilePicture);
      formData.append("bio", bio);
      try {
        const response = await axiosPrivate.patch(
          `/api/users/${userJSON._id}`,
          formData
        );

        if (response?.data?.status === "success") {
          setUserJSON(response?.data?.data?.user);
        }
      } catch (error) {
        console.error(error);
      }
    }
    toggleEditing();
  }

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
            {editing && <UploadImage setImage={setProfilePicture} />}
          </div>
          <div className="profile-bio">
            {editing ? (
              <input
                type={"text"}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></input>
            ) : (
              userJSON.bio
            )}
          </div>
          {editing && (
            <Button
              variant="outlined"
              className="profile-follow-button"
              onClick={() => toggleEditing()}
            >
              Cancel
            </Button>
          )}
          {userJSON._id == auth?.userId && (
            <Button
              variant="outlined"
              className="profile-follow-button"
              onClick={(e) => {
                updateProfile(e);
              }}
            >
              {editing ? "Save" : "Edit Profile"}
            </Button>
          )}
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
      {userJSON.avatar && (
        <Feed
          posts={posts}
          showModal={props.showModal}
          setProfileTab={props.setProfileTab}
        />
      )}
      {userJSON.avatar && endReached && (
        <div>You've reached the end, follow people for more content!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Profile;
