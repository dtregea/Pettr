import React, { useEffect, useState, useRef } from "react";

import "../styles/PostBox.css";
import { Button, Avatar } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UploadImage from "./UploadImage";
import toast from 'react-hot-toast';


function PostBox(props) {
  const [avatar, setAvatar] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [image, setImage] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAvatar = async () => {
      try {
        const response = await axiosPrivate.get(
          `/api/users/${auth?.userId}/avatar`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setAvatar(response?.data?.data?.avatar);
        isMounted && setLoading(false);
      } catch (error) {
        if (!error.message === "canceled") {
          console.error(error);
        }
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
    if (!content && !image) {
      return;
    }
    let loadingToast = toast.loading(image ? "Uploading" : props.reply ? 'Replying...' : 'Posting...');
    let formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    try {
      let route = props.reply ? `/api/posts/${props.postId}/comments` : `/api/posts`;
      const response = await axiosPrivate.post(route, formData);
      toast.dismiss(loadingToast);
      if (response?.data?.status === "success") {
        if(props.reply) {
          props.toggleCommentBox();
        } else {
          setContent('');
          setContentLength(0);
        }
        toast.success(`${props.reply ? 'Reply' : 'Post'} has been submitted!`);
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error?.message == "canceled") {
        return;
      } 
      if (error?.response?.status === 400 || error?.response?.status === 500) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Could not talk with the server');
      }
      
    }
  }

  return (
    <div className={`post-box ${props.reply ? '' : 'post-box-border'}`}>
      
      <form onSubmit={createPost} encType="multipart/form-data">
        <div className="post-box-length-container">
          <div className="post-box-input-container">
            {isLoading ? (
              <div className="post-box-avatar-hidden">
                <Avatar />
              </div>
            ) : (
              <Avatar src={avatar} />
            )}
            <input
            className="post-box-input"
              placeholder={props.reply ? 'Enter your reply' : 'What\'s up?'}
              onChange={(e) => {
                setContent(e.target.value);
                setContentLength(e.target.value.length);
              }}
              value={content}
            ></input>
          </div>
          <span className="post-headerSpecial">{contentLength} / 280</span>
        </div>
        
        <UploadImage setImage={setImage} />
        
        <Button type="submit" className="post-box-button">
          {props.reply ? 'Reply' : 'Post'}
        </Button>
      </form>
    </div>
  );
}

export default PostBox;
