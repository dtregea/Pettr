import React, { useEffect, useState } from "react";
import "../styles/PostBox.css";
import { Button, Avatar } from "@mui/material";
function PostBox() {
  const [avatar, setAvatar] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => {
    async function fetchAvatar() {
      const response = await fetch(
        `http://localhost:5000/api/users/${localStorage.getItem("id")}/avatar`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const data = await response.json();
      if (data.status) console.log(data);
      if (data.data.avatar) {
        setAvatar(data.data.avatar);
        setLoading(false);
      }
    }
    fetchAvatar();
  }, []);

  async function createPost(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        content,
        image,
      }),
    });

    const data = await response.json();
    if (data) {
      if (data.status === "success") {
        window.location.reload();
      } else if (data.status === "fail") {
        alert("user error");
      } else {
        alert(data.message);
      }
    }
  }

  return (
    <div className="post-box">
      <form onSubmit={createPost}>
        <div className="post-box-input">
          {isLoading ? (
            <div className="post-box-avatar-hidden">
              <Avatar />
            </div>
          ) : (
            <Avatar src={avatar} />
          )}
          <input
            placeholder="What's up?"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            name="content"
          ></input>
        </div>
        {/* TODO file upload */}
        <input
          className="post-box-image-input"
          placeholder="Enter image url"
          type="text"
          onChange={(e) => {
            setImage(e.target.value);
          }}
          name="image"
        ></input>
        <Button type="submit" className="post-box-button">
          Post
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
