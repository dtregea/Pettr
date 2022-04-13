import React, { useEffect, useState, useRef } from "react";

import "../styles/PostBox.css";
import { Button, Avatar } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function PostBox() {
  const [avatar, setAvatar] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAvatar = async () => {
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5000/api/users/${auth?.userId}/avatar`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setAvatar(response?.data?.data?.avatar);
        isMounted && setLoading(false);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    fetchAvatar();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  async function createPost(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    try {
      const response = await axiosPrivate.post(
        `http://localhost:5000/api/posts/`,
        formData
      );

      if (response?.data?.status === "success") {
        window.location.reload();
      } else if (response?.data?.status === "fail") {
        alert("user error");
      } else {
        alert("server error");
      }
    } catch (error) {
      console.error(error);
      navigate("/login", { state: { from: location }, replace: true });
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
