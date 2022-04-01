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

function Post(props) {
  const [likes, setLikes] = useState(props.likeCount);
  const [likedByUser, setLikedByUser] = useState(props.isLiked);
  const [reposts, setReposts] = useState(props.repostCount);
  const [repostedByUser, setRepostedByUser] = useState(props.isReposted);
  const [comments, setComments] = useState(props.commentCount);
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    setShowCommentBox(showCommentBox);
  }, [showCommentBox]);

  useEffect(() => {
    setLikes(props.likeCount);
  }, [props.likeCount]);

  useEffect(() => {
    setLikedByUser(props.isLiked);
  }, [props.isLiked]);

  useEffect(() => {
    setReposts(props.repostCount);
  }, [props.repostCount]);

  useEffect(() => {
    setRepostedByUser(props.isReposted);
  }, [props.isReposted]);

  const [waiting, setWaiting] = useState(false);

  async function toggleLike() {
    let route = likedByUser ? "unlike" : "like";
    if (!waiting) {
      setWaiting(true);
      const response = await fetch(
        `http://localhost:5000/api/posts/${props._id}/${route}`,
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
        `http://localhost:5000/api/posts/${props._id}/${route}`,
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

  function activateModal() {
    if (!props.isModal) {
      props.showPostModal({
        text: props.text,
        _id: props._id,
        verified: props.verified,
        timestamp: props.timestamp,
        image: props.image,
        user: props.user,
        likeCount: likes,
        repostCount: reposts,
        commentCount: props.commentCount,
        isLiked: props.isLiked,
        isReposted: props.isReposted,
      });
    }
  }

  return (
    <div
      className={`post-container ${props.trendingView && "trending"}`}
      onClick={activateModal}
    >
      <div className={`post`}>
        <div className="post-avatar" onClick={(e) => e.stopPropagation()}>
          <Avatar src={props.user && props.user.avatar} />
        </div>
        <div className="post-body">
          <div className="post-header">
            <div className="post-headerText">
              <span className="post-headerSpecial">
                {props.repostedBy != null && props.repostedBy + " reposted"}
              </span>

              <h3>
                {props.user && props.user.displayname}{" "}
                <span className="post-headerSpecial">
                  {props.verified && <VerifiedIcon className="post-badge" />} @
                  {props.user && props.user.username}
                </span>
              </h3>
            </div>
            <div className="post-headerDescription">
              <p>{props.text && props.text}</p>
            </div>
          </div>
          {props.image !== "" && (
            <img className="post-image" src={props.image} alt="" />
          )}

          <div className="post-footer" onClick={(e) => e.stopPropagation()}>
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
            <div></div>
          </div>
        </div>
      </div>

      {(showCommentBox || props.isModal) && (
        <div onClick={(e) => e.stopPropagation()}>
          <CommentBox
            updateCommentCount={updateCommentCount}
            postId={props._id}
            toggleCommentBox={toggleCommentBox}
            addPost={props.addPost}
          />
        </div>
      )}
    </div>
  );
}

export default Post;
