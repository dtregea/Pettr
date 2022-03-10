import React, { useEffect, useState } from "react";
import "../styles/PostBox.css";
import { Button, Avatar } from "@mui/material";
function PostBox() {
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        `http://localhost:5000/api/user/${localStorage.getItem("token")}/avatar`
      );
      const data = await response.json();
      if (data.avatar) {
        setAvatar(data.avatar);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="post-box">
      <form>
        <div className="post-box-input">
          <Avatar src={avatar} />
          <input placeholder="What's up?"></input>
        </div>
        {/* TODO file upload */}
        <input
          className="post-box-image-input"
          placeholder="Enter image url"
          type="text"
        ></input>
        <Button className="post-box-button" type="text">
          Post
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
