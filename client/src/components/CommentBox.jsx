import React, { useState } from "react";
import { Button } from "@mui/material";
import "../styles/PostBox.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import UploadImage from "./UploadImage";
function CommentBox(props) {
  let [comment, setComment] = useState("");
  let [image, setImage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  //change to postbox eventually
  async function postComment(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("image", image);
    formData.append("comment", comment);
    try {
      const response = await axiosPrivate.post(
        `http://localhost:5000/api/posts/${props.postId}/comments`,
        formData
      );
      if (response?.data?.status === "success") {
        props.updateCommentCount(response?.data?.data?.commentCount);
        setComment("");
        props.toggleCommentBox();
      }
    } catch (error) {
      console.error(error);
      navigate("/login", { state: { from: location }, replace: true });
    }
  }
  return (
    <div>
      <form onSubmit={postComment} encType="multipart/form-data">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Enter your reply"
        />
        {/* <input
          className="post-box-image-input"
          placeholder="Upload Image"
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        ></input> */}
        <UploadImage setImage={setImage} />
        <Button type="submit" className="post-box-button">
          Reply
        </Button>
      </form>
    </div>
  );
}

export default CommentBox;
