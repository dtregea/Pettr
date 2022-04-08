import React, { useEffect, useState, useRef } from "react";
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
      if (data.data.avatar) {
        setAvatar(data.data.avatar);
        setLoading(false);
      }
    }
    fetchAvatar();
  }, []);

  async function createPost(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    const response = await fetch("http://localhost:5000/api/posts/", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
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
      <form onSubmit={createPost} encType="multipart/form-data">
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
          ></input>
        </div>
        <input
          className="post-box-image-input"
          placeholder="Upload Image"
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        ></input>
        <Button type="submit" className="post-box-button">
          Post
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
