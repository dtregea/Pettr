import React, { useState, useEffect } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
//import { HeartSwitch } from "@anatoliygatt/heart-switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentBox from "./CommentBox";

function Post({
  text,
  id,
  verified,
  timestamp,
  image,
  trendingView,
  user,
  likeCount,
  repostCount,
  commentCount,
  isLiked,
  isReposted,
  repostedBy,
}) {
  const [likes, setLikes] = useState(likeCount);
  const [likedByUser, setLikedByUser] = useState(isLiked);
  const [reposts, setReposts] = useState(repostCount);
  const [repostedByUser, setRepostedByUser] = useState(isReposted);
  const [comments, setComments] = useState(commentCount);
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    setShowCommentBox(showCommentBox);
  }, [showCommentBox]);

  useEffect(() => {
    setLikes(likeCount);
  }, [likeCount]);

  useEffect(() => {
    setLikedByUser(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setReposts(repostCount);
  }, [repostCount]);

  useEffect(() => {
    setRepostedByUser(isReposted);
  }, [isReposted]);

  const [waiting, setWaiting] = useState(false);

  async function toggleLike() {
    let route = likedByUser ? "unlike" : "like";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/${route}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        if (fetchedData.status === "success") {
          setLikes(fetchedData.data.likeCount);
          setLikedByUser(fetchedData.data.isLiked);
        } else if (fetchedData.status === "fail") {
          setLikes(likedByUser ? likes - 1 : likes + 1);
          setLikedByUser(fetchedData.data.isLiked);
        }
        setWaiting(false);
      }
    }
  }

  async function toggleRepost() {
    let route = repostedByUser ? "unrepost" : "repost";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/${route}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        console.log(fetchedData);
        if (fetchedData.status === "success") {
          setReposts(fetchedData.data.repostCount);
          setRepostedByUser(fetchedData.data.isReposted);
        } else if (fetchedData.status === "fail") {
          setReposts(repostedByUser ? reposts - 1 : reposts + 1);
          setRepostedByUser(fetchedData.data.isReposted);
        }
        setWaiting(false);
      }
    }
  }

  function toggleCommentBox() {
    setShowCommentBox(!showCommentBox);
  }

  function updateCommentCount(commentCount) {
    console.log("updating");
    setComments(commentCount);
  }
  return (
    <div className="post-container">
      <div className={`post ${trendingView && "trending"}`}>
        <div className="post-avatar">
          <Avatar src={user.avatar} />
        </div>
        <div className="post-body">
          <div className="post-header">
            <div className="post-headerText">
              <span className="post-headerSpecial">
                {repostedBy != null && repostedBy + " reposted"}
              </span>

              <h3>
                {user.displayname}{" "}
                <span className="post-headerSpecial">
                  {verified && <VerifiedIcon className="post-badge" />} @
                  {user.username}
                </span>
              </h3>
            </div>
            <div className="post-headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <img src={image} alt="" />
          <div className="post-footer">
            <div onClick={toggleCommentBox}>
              <ChatBubbleOutlineIcon fontSize="small" /> {comments}
            </div>
            <div onClick={toggleRepost}>
              {!repostedByUser && <RepeatIcon fontSize="small" />}
              {repostedByUser && (
                <RepeatIcon fontSize="small" style={{ color: "green" }} />
              )}{" "}
              {reposts}
            </div>
            <div onClick={toggleLike}>
              {!likedByUser && <FavoriteBorderIcon fontSize="small" />}
              {likedByUser && (
                <FavoriteIcon fontSize="small" style={{ color: "red" }} />
              )}{" "}
              {likes}
            </div>
          </div>
        </div>
      </div>
      {showCommentBox && (
        <CommentBox updateCommentCount={updateCommentCount} postId={id} />
      )}
    </div>
  );
}

export default Post;
