import React, { useState, useEffect } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
//import { HeartSwitch } from "@anatoliygatt/heart-switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Post({
  text,
  id,
  verified,
  timestamp,
  image,
  trendingView,
  user,
  likeCount,
  repostCount,
  commentCount,
  isLiked,
  isReposted,
}) {
  const [likes, setLikes] = useState(likeCount);
  const [liked, setLiked] = useState(isLiked);
  const [reposts, setReposts] = useState(repostCount);
  const [reposted, setReposted] = useState(isReposted);

  useEffect(() => {
    setLikes(likeCount);
  }, []);

  useEffect(() => {
    setLiked(isLiked);
  }, []);

  useEffect(() => {
    setReposts(repostCount);
  }, []);

  useEffect(() => {
    setReposted(isReposted);
  }, []);

  const [waiting, setWaiting] = useState(false);

  async function toggleLike() {
    let route = liked ? "unlike" : "like";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/${route}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        if (fetchedData.status === "success") {
          setLikes(fetchedData.data.likeCount);
          setLiked(fetchedData.data.isLiked);
        } else if (fetchedData.status === "fail") {
          setLikes(liked ? likes - 1 : likes + 1);
          setLiked(fetchedData.data.isLiked);
        }
        setWaiting(false);
      }
    }
  }

  async function toggleRepost() {
    let route = reposted ? "unrepost" : "repost";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/${route}`,
        {
          method: "PATCH",
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
          setReposts(fetchedData.data.repostCount);
          setReposted(fetchedData.data.isReposted);
        } else if (fetchedData.status === "fail") {
          setReposts(reposted ? reposts - 1 : reposts + 1);
          setReposted(fetchedData.data.isReposted);
        }
        setWaiting(false);
      }
    }
  }
  return (
    <div className={`post ${trendingView && "trending"}`}>
      <div className="post-avatar">
        <Avatar src={user.avatar} />
      </div>
      <div className="post-body">
        <div className="post-header">
          <div className="post-headerText">
            <h3>
              {user.displayname}{" "}
              <span className="post-headerSpecial">
                {verified && <VerifiedIcon className="post-badge" />} @
                {user.username}
              </span>
            </h3>
          </div>
          <div className="post-headerDescription">
            <p>{text}</p>
          </div>
        </div>
        <img src={image} alt="" />
        <div className="post-footer">
          <div>
            <ChatBubbleOutlineIcon fontSize="small" /> {commentCount}
          </div>
          <div onClick={toggleRepost}>
            {!reposted && <RepeatIcon fontSize="small" />}
            {reposted && (
              <RepeatIcon fontSize="small" style={{ color: "green" }} />
            )}{" "}
            {reposts}
          </div>
          <div onClick={toggleLike}>
            {!liked && <FavoriteBorderIcon fontSize="small" />}
            {liked && (
              <FavoriteIcon fontSize="small" style={{ color: "red" }} />
            )}{" "}
            {likes}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
