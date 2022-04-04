import React, { useState } from "react";
import { Button } from "@mui/material";
import "../styles/PostBox.css";
function CommentBox(props) {
  let [comment, setComment] = useState("");
  let [image, setImage] = useState("");
  //change to postbox eventually
  async function postComment(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append("image", image);
    formData.append("comment", comment);
    let response = await fetch(
      `http://localhost:5000/api/posts/${props.postId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      }
    );

    const fetchedData = await response.json();
    if (fetchedData) {
      console.log(fetchedData);
      if (fetchedData.status === "success") {
        props.updateCommentCount(fetchedData.data.commentCount);
        setComment("");
        props.toggleCommentBox();
      }
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
        <input
          className="post-box-image-input"
          placeholder="Upload Image"
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        ></input>
        <Button type="submit" className="post-box-button">
          Reply
        </Button>
      </form>
    </div>
  );
}

export default CommentBox;
