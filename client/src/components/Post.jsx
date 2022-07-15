import React, { useState, useEffect, useLayoutEffect } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
//import { HeartSwitch } from "@anatoliygatt/heart-switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentBox from "./CommentBox";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Post(props) {
  const [likes, setLikes] = useState(props.likeCount);
  const [likedByUser, setLikedByUser] = useState(props.isLiked);
  const [reposts, setReposts] = useState(props.repostCount);
  const [repostedByUser, setRepostedByUser] = useState(props.isReposted);
  const [comments, setComments] = useState(props.commentCount);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);

    if (seconds <= 1) {
      return "just now";
    }
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  async function toggleLike() {
    let route = likedByUser ? "unlike" : "like";
    if (!waiting) {
      setWaiting(true);
      try {
        const response = await axiosPrivate.patch(
          `/api/posts/${props._id}/${route}`
        );
        if (response?.data?.status === "success") {
          setLikes(response?.data?.data?.likeCount);
          setLikedByUser(response?.data?.data?.isLiked);
        }
      } catch (error) {
        if (!error.message === "canceled") {
          console.error(error);
        }
      }
      setWaiting(false);
    }
  }

  async function toggleRepost() {
    let route = repostedByUser ? "unrepost" : "repost";
    if (!waiting) {
      setWaiting(true);
      try {
        const response = await axiosPrivate.patch(
          `/api/posts/${props._id}/${route}`
        );
        if (response?.data?.status === "success") {
          setReposts(response?.data?.data?.repostCount);
          setRepostedByUser(response?.data?.data?.isReposted);
        }
      } catch (error) {
        console.error(error);
      }
      setWaiting(false);
    }
  }

  function toggleCommentBox() {
    setShowCommentBox(!showCommentBox);
  }

  function updateCommentCount(commentCount) {
    setComments(commentCount);
  }

  async function fetchReplies() {
    try {
      const response = await axiosPrivate.get(
        `/api/posts/${props._id}/comments`
      );
      if (response?.data?.status === "success") {
        return response?.data?.data?.comments;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchReplyTo() {
    try {
      const response = await axiosPrivate.get(
        `/api/posts/${props._id}/replyTo`
      );
      if (response?.data?.status === "success") {
        return response?.data?.data?.post[0];
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function activateModal() {
    if (!props.isModal) {
      let replies = await fetchReplies();
      let replyTo = await fetchReplyTo();
      let propBuilder = {};
      if (replyTo) {
        propBuilder.header = {
          component: "Post",
          props: {
            key: replyTo._id,
            text: replyTo.content,
            _id: replyTo._id,
            verified: replyTo.verified,
            timestamp: replyTo.timestamp,
            images: replyTo.images,
            user: replyTo.user,
            likeCount: replyTo.likeCount,
            repostCount: replyTo.repostCount,
            commentCount: replyTo.commentCount,
            isLiked: replyTo.isLiked,
            isReposted: replyTo.isReposted,
            showModal: props.showModal,
            pet: replyTo.pet,
          },
        };
      } else {
        propBuilder.header = {};
      }
      props.showModal({
        header: propBuilder.header,
        body: {
          component: "Post",
          props: {
            key: props._id,
            text: props.text,
            _id: props._id,
            verified: props.verified,
            timestamp: props.timestamp,
            images: props.images,
            user: props.user,
            likeCount: likes,
            repostCount: reposts,
            commentCount: comments,
            isLiked: likedByUser,
            isReposted: repostedByUser,
            isModal: true,
            pet: props.pet,
          },
        },
        footer: {
          component: "Feed",
          props: {
            posts: replies,
            showModal: props.showModal,
            isModalReply: true,
          },
        },
      });
    }
  }

  function activateProfile() {
    props.setProfileTab(props.user._id);
    if (props.isModal || props.isModalReply) {
      props.closeModal();
    }
  }

  return (
    <div>
      <div
        className={`post-container ${props.trendingView && "trending"} ${
          props.isModal && "post-modal"
        }`}
      >
        <div className="post">
          <div className="post-avatar" onClick={(e) => e.stopPropagation()}>
            <Avatar
              src={props?.user?.avatar}
              onClick={activateProfile}
              style={{ visibility: props.user ? "visible" : "hidden" }}
              className="post-avatar-img"
            />
          </div>
          <div className="post-header">
            <div className="post-headerText">
              <span className="post-headerSpecial">
                {props.repostedBy != null && props.repostedBy + " reposted"}
              </span>

              <h3>
                {props.user && props.user.displayname}{" "}
                {props.pet && props.pet.name}{" "}
                <span className="post-headerSpecial">
                  {props.verified && <VerifiedIcon className="post-badge" />} @
                  {props.user && props.user.username}
                  {props.pet && props.pet.species} -
                </span>
                <span className="post-headerSpecial post-time">
                  {`${timeSince(
                    new Date(
                      props.pet?.published_at
                        ? props.pet.published_at
                        : props.timestamp
                    )
                  )} ago`}
                </span>
              </h3>
            </div>
          </div>
          <div className="post-content" onClick={activateModal}>
            <p>{props.text && props.text}</p>
            <div className="image-container">
              {props.user && props.images[0] && (
                <img className="post-image" src={`${props.images[0]}`} alt="" />
              )}

              {props?.pet?.photos && (
                <img
                  className="post-image"
                  src={
                    props.pet.photos[0]
                      ? props.pet.photos[0]
                      : "https://res.cloudinary.com/pettr/image/upload/c_scale,q_auto,r_30,w_250/v1657496133/istockphoto-1142468738-612x612_waudh2.jpg"
                  }
                ></img>
              )}
            </div>
          </div>

          <div className="post-footer" onClick={(e) => e.stopPropagation()}>
            <div className="post-footer-icon" onClick={toggleCommentBox}>
              <ChatBubbleOutlineIcon fontSize="small" /> {comments}
            </div>

            <div className="post-footer-icon" onClick={toggleRepost}>
              {!repostedByUser && <RepeatIcon fontSize="small" />}
              {repostedByUser && (
                <RepeatIcon fontSize="small" style={{ color: "green" }} />
              )}{" "}
              {reposts}
            </div>
            <div className="post-footer-icon" onClick={toggleLike}>
              {!likedByUser && <FavoriteBorderIcon fontSize="small" />}
              {likedByUser && (
                <FavoriteIcon fontSize="small" style={{ color: "red" }} />
              )}{" "}
              {likes}
            </div>
            <div></div>
          </div>
          {/* </div> */}
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
