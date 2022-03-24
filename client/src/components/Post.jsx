import React, { useState, useEffect } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
//import { HeartSwitch } from "@anatoliygatt/heart-switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

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
}) {
  async function likePost() {
    const response = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const fetchedData = await response.json();
    if (fetchedData) {
      console.log(fetchedData);
      if (fetchedData.status === "success") {
        likeCount = fetchedData.data.likeCount;
      } else if (fetchedData.status === "fail") {
        alert("User error");
      } else {
        alert("Server error: " + fetchedData.message);
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
          <div>
            <RepeatIcon fontSize="small" /> {repostCount}
          </div>
          <div onClick={likePost}>
            <FavoriteBorderIcon fontSize="small" /> {likeCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
