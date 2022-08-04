import React, { useState, useEffect, useRef } from "react";
import "../styles/Profile.css";
import Feed from "./Feed";
import { Avatar, Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UploadImage from "./UploadImage";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
import toast from 'react-hot-toast';
import { useParams } from "react-router-dom";
function Profile(props) {
  const { auth } = useAuth();
  let { userId } = useParams();

  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString());
  const [userJSON, setUserJSON] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [waiting, setWaiting] = useState(false); // Waiting for profile updates
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [followedByUser, setFollowedByUser] = useState(false);
  const [page, setPage] = useState(1);
  const [contentLength, setContentLength] = useState(0);
  const { isLoading, results, hasNextPage, setResults, setIsLoading, deleteResult } =
    usePagination(
      page,
      startedBrowsing,
      "posts",
      `/api/users/${userId}/posts`,
      {},
      [userId]
    );
  const [profilePicture, setProfilePicture] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const profile = useRef();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchUserInfo() {
      try {
        const response = await axiosPrivate.get(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        if (response?.data?.status === "success") {
          if (isMounted) {
            let userJSON = response?.data?.data?.user;
            setUserJSON(userJSON);
            setProfilePicture(userJSON.avatar);
            if (userJSON.bio) {
              setBio(userJSON.bio);
              setContentLength(String(userJSON.bio).length);
            }
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
  }, [userId, followedByUser]);

  useEffect(() => {
    setStartedBrowsing(new Date().toISOString());
    return () => {
      setPage(1);
      setResults([]);
    };
  }, [userId]);





  // Only make changes on profile that occur on server
  // useEffect(() => {
  //   setBio(userJSON.bio);
  //   setContentLength(String(userJSON.bio).length);
  //   setProfilePicture(userJSON.avatar);
  // }, [userJSON]);



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
          setFollowedByUser(response?.data?.data?.isFollowed);
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
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  function toggleEditing() {
    setEditing(!editing);
  }

  async function updateProfile(event) {
    event.preventDefault();
    if (editing && !waiting) {
      setWaiting(true);
      if (!bio && !profilePicture) {
        return;
      }
      let loadingMessage = 'Updating...';
      let formData = new FormData();
      if (profilePicture) {
        formData.append("image", profilePicture);
        loadingMessage = 'Uploading...'
      }
      if (bio) {
        formData.append("bio", bio);
      }
      let loadingToast = toast.loading(loadingMessage);
      try {
        const response = await axiosPrivate.patch(
          `/api/users/${userJSON._id}`,
          formData
        );
        toast.dismiss(loadingToast);
        if (response?.data?.status === "success") {
          setUserJSON(response?.data?.data?.user);
          toast.success('Profile updated');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        if (error?.message == "canceled") {
          return;
        }
        if (error?.response?.status === 400 || error?.response?.status === 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('Could not talk with the server');
        }
      }
      setWaiting(false);
    }
    toggleEditing();
  }

  return (
    <div className="profile" onScroll={onScroll} ref={profile}>
      {/* Header */}

      <div className="header">Profile</div>

      {userJSON.avatar && (
        <div className="profile-box">
          <div className="profile-avatar-container">
            <Avatar
              className="profile-avatar"
              sx={{ height: "70px", width: "70px" }}
              src={userJSON.avatar}
            />
            <div className="profile-upload">
              {editing && <UploadImage setImage={setProfilePicture} />}
            </div>
          </div>
          <div className="profile-bio text-wrap">
            {editing ? (
              <input
                type={"text"}
                value={bio}
                onChange={(e) => { setBio(e.target.value); setContentLength(e.target.value.length) }}
              ></input>
            ) : (
              userJSON.bio
            )}
            {editing && <span className="post-headerSpecial">{contentLength} / 140</span>}
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
                <span className="post-headerSpecial">@{userJSON.username}</span>
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
                <span className="profile-label">Posts</span>
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
          posts={results}
          deletePost={deleteResult}
        />
      )}
      {userJSON.avatar && !isLoading && !hasNextPage && (
        <div>You've reached the end of {userJSON.displayname}'s profile!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Profile;
