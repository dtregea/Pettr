import React, { useState } from 'react'
import { Avatar, Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import VerifiedIcon from "@mui/icons-material/Verified";
import "../styles/User.css"
import { useNavigate } from 'react-router-dom';

function User(props) {
  const [waiting, setWaiting] = useState(false);
  const [followedByUser, setFollowedByUser] = useState(props.isFollowed);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

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
              followed: props._id,
            })}`
          );
        } else if (method === "DELETE") {
          response = await axiosPrivate.delete(
            `/api/follow?${new URLSearchParams({
              follower: auth?.userId,
              followed: props._id,
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

  return (
    <div className="user">
      <div className="user-avatar">
        <Avatar
          src={props?.avatar}
          onClick={e => { navigate(`/profile/${props._id}`) }} className="post-avatar-img"
        />
      </div>
      <div className="user-header">
        <div className="post-headerText text-wrap">
          <h3>
            {props.displayname}{" "}
            <span className="post-headerSpecial">
              {props.verified && <VerifiedIcon className="post-badge" />} @
              {props.username}
            </span>
          </h3>
        </div>
      </div>
      <div className="user-bio">
        {props.bio}
      </div>
      {props._id != auth?.userId && (
        <Button
          variant="outlined"
          className="user-follow-button"
          onClick={toggleFollow}
        >
          {followedByUser ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  )
}

export default User;