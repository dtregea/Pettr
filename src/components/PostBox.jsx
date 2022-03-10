import React, { useEffect, useState, Component } from "react";

import "../styles/PostBox.css";
import { Button, Avatar } from "@mui/material";
function PostBox() {
  const [avatar, setAvatar] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchAvatar() {
      const response = await fetch(
        `http://localhost:5000/api/user/${localStorage.getItem("token")}/avatar`
      );
      const data = await response.json();
      if (data.avatar) {
        setAvatar(data.avatar);
        setLoading(false);
      }
    }
    fetchAvatar();
  }, []);

  return (
    <div className="post-box">
      <form>
        <div className="post-box-input">
          {isLoading ? (
            <div className="post-box-avatar-hidden">
              <Avatar />
            </div>
          ) : (
            <Avatar src={avatar} />
          )}
          <input placeholder="What's up?"></input>
        </div>
        {/* TODO file upload */}
        <input
          className="post-box-image-input"
          placeholder="Enter image url"
          type="text"
        ></input>
        <Button type="submit" className="post-box-button">
          Post
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
