import React, { useState } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
//import { HeartSwitch } from "@anatoliygatt/heart-switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

function Post({ text, verified, timestamp, image, trendingView, user }) {
  const [avatar, setAvatar] = useState(undefined);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  return (
    <div className={`post ${trendingView && "trending"}`}>
      <div className="post-avatar">
        <Avatar src={avatar} />
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
          <ChatBubbleOutlineIcon fontSize="small" />
          <RepeatIcon fontSize="small" />
          <FavoriteBorderIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
}

export default Post;
