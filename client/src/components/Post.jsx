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
  verified,
  timestamp,
  image,
  trendingView,
  user: userId,
  likeCount,
  repostCount,
  commentCount,
}) {
  const [isLoading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(undefined);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function fetchAvatar() {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/userPostInfo`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const fetchedData = await response.json();

      if (fetchedData.status === "success") {
        setAvatar(fetchedData.data.user.avatar);
        setUsername(fetchedData.data.user.username);
        setDisplayName(fetchedData.data.user.displayname);
        setLoading(false);
      } else if (fetchedData === "fail") {
        alert("Server error");
      } else {
        alert("Server error");
      }
    }
    fetchAvatar();
  }, []);

  return (
    <div className={`post ${trendingView && "trending"}`}>
      <div className="post-avatar">
        {isLoading ? (
          <div className="post-avatar-hidden">
            <Avatar />
          </div>
        ) : (
          <Avatar src={avatar} />
        )}
      </div>
      <div className="post-body">
        <div className="post-header">
          <div className="post-headerText">
            <h3>
              {displayName}{" "}
              <span className="post-headerSpecial">
                {verified && <VerifiedIcon className="post-badge" />} @
                {username}
              </span>
            </h3>
          </div>
          <div className="post-headerDescription">
            <p>{text}</p>
          </div>
        </div>
        <img src={image} alt="" />
        <div className="post-footer">
          <ChatBubbleOutlineIcon fontSize="small" /> {commentCount}
          <RepeatIcon fontSize="small" /> {repostCount}
          <FavoriteBorderIcon fontSize="small" /> {likeCount}
        </div>
      </div>
    </div>
  );
}

export default Post;
