import React, { useState } from "react";
import { Button } from "@mui/material";
import "../styles/PostBox.css";
function CommentBox(props) {
  let [comment, setComment] = useState("");
  let [image, setImage] = useState("");
  //change to postbox eventually
  async function postComment(event) {
    console.log(props);
    event.preventDefault();

    let response = await fetch(
      `http://localhost:5000/api/posts/${props.postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          comment,
          image,
        }),
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
      <form onSubmit={postComment}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          placeholder="Enter your reply"
        />
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
          Reply
        </Button>
      </form>
    </div>
  );
}

export default CommentBox;
