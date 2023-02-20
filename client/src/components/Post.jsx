import React, { useState } from "react";
import "../styles/Post.css";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PostBox from "./PostBox";
import { useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import useAuth from "../hooks/useAuth";
import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function Post(props) {
  const navigate = useNavigate();
  const { setModalProps, setModalOpen, setModalLoading } = useModal();
  const { auth } = useAuth();
  const [likes, setLikes] = useState(props.likeCount);
  const [likedByUser, setLikedByUser] = useState(props.isLiked);
  const [reposts, setReposts] = useState(props.repostCount);
  const [repostedByUser, setRepostedByUser] = useState(props.isReposted);
  const [comments, setComments] = useState(props.commentCount);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
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

  function toggleDropdown() {
    setMoreDropdown(!moreDropdown);
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
          setLikes(likedByUser ? likes - 1 : likes + 1);
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
          setReposts(repostedByUser ? reposts - 1 : reposts + 1);
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

  async function fetchReplyTo() {
    if (props.replyTo) {
      try {
        const response = await axiosPrivate.get(
          `/api/posts/${props.replyTo}`
        );
        if (response?.data?.status === "success") {
          return response?.data?.data?.post;
        } else {
          return [];
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return null;
    }
  }

  async function activateModal() {
    if (props.isModal) {
      return;
    }
    setModalLoading(true);
    setModalOpen(true);
    let replyTo = await fetchReplyTo();

    let postModalInfo = { header: {}, body: {}, footer: {} };
    if (replyTo) {
      postModalInfo.header = {
        component: "Post",
        props: {
          key: replyTo._id,
          ...replyTo,
        },
      };
    }
    postModalInfo.body = {
      component: "Post",
      props: {
        key: props._id,
        ...props,
        likeCount: likes,
        repostCount: reposts,
        commentCount: comments,
        isLiked: likedByUser,
        isReposted: repostedByUser,
        isModal: true,
      },
    };
    setModalLoading(false);
    setModalProps({
      ...postModalInfo
    });

  }

  async function deletePost() {
    if (!waiting) {
      setWaiting(true);
      let loadingToast = toast.loading('Deleting...');

      try {
        const response = await axiosPrivate.delete(
          `/api/posts/${props._id}`
        );
        toast.dismiss(loadingToast);

        if (response?.data?.status === "success") {
          if (props.deletePost) {
            props.deletePost(props._id);
          }
          toast.success(`Post has been deleted!`);
        }


      } catch (error) {
        toast.dismiss(loadingToast);

        if (!error.message === "canceled") {
          console.error(error);
        }
        if (error?.response?.status === 400 || error?.response?.status === 500) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('Failed to delete');
        }
      }
      setWaiting(false);
    }
  }


  return (
    <div>
      <div
        className={`post-container ${props.trendingView && "trending"} ${props.isModal && "post-modal"
          }`}
      >
        <div className="post">

          <div className="post-avatar" onClick={(e) => e.stopPropagation()}>
            <Avatar
              src={props?.user?.avatar}
              onClick={e => { setModalOpen(false); navigate(`/profile/${props.user._id}`) }}
              style={{ visibility: props.user ? "visible" : "hidden" }}
              className="post-avatar-img"
            />
          </div>
          <div className="post-header">
            <div className="post-headerText text-wrap">

              {/* Special reply or reposted by text */}
              <span className="post-headerSpecial">
                {props.replyToName && `In reply to ${props.replyToName}`}
              </span>
              <span className="post-headerSpecial">
                {!props.replyToName && props.repostedBy != null && props.repostedBy + " reposted"}
              </span>

              {/* Post Info */}
              <h4 className="post-info">
                {props.user && props.user.displayname}{" "}
                {props.pet && props.pet.name}{" "}

                <span className="post-headerSpecial">

                  @
                  {props.user && props.user.username}
                  {props.user?.verified && <VerifiedIcon fontSize="small" className="post-badge" />}
                  {props.pet && props.pet.species} -
                  {` ${timeSince(
                    new Date(
                      props.pet?.published_at
                        ? props.pet.published_at
                        : props.timestamp || props.createdAt
                    )
                  )} ago`}
                </span>

              </h4>
            </div>
          </div>

          {/* Post Image and Content */}
          <div className="post-content" onClick={activateModal}>
            <p className="text-wrap">{props.content && props.content}</p>
            <div className="image-container">
              {props.user && props.images[0] && (
                <img loading="lazy" className="post-image" src={`${props.images[0]}`} alt="" />
              )}

              {props?.pet?.images && (
                <img
                  loading="lazy"
                  className="post-image"
                  src={
                    props.pet.images.length > 1 ? props.pet.images[1] : props.pet.images[0]
                  }
                ></img>
              )}
            </div>
          </div>

          {/* Icons */}
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
            <div className="post-footer-icon more-container" onClick={toggleDropdown}>
              {auth?.userId === props.user?._id && <MoreHorizIcon fontSize="small" />}
              {moreDropdown &&
                <Dropdown.Item className="more-dropdown">
                  <ListGroup className="list-group">
                    <ListGroup.Item
                      action
                      className="more-dropdown-item"
                      onClick={() => {
                        confirmAlert({
                          title: 'Confirm to Delete',
                          message: 'Are you sure want to delete this post?',
                          buttons: [
                            {
                              label: 'Yes',
                              onClick: () => deletePost()
                            },
                            {
                              label: 'No'
                            }
                          ]
                        });
                      }
                      }
                    >
                      Delete
                    </ListGroup.Item>
                  </ListGroup>
                </Dropdown.Item>}

            </div>
            <div></div>
          </div>
          {props.isModal && props.pet && (
            <div className="about">

              <p className="post-headerSpecial">
                {props.pet.gender} • {" "}
                {props.pet.age} 
                {props.pet.colors.primary ? " • " + props.pet.colors.primary: ""} • {" "}
                {props.pet.breeds.primary} 
                {props.pet.status ? " • " + capitalizeFirstLetter(props.pet.status): ""}
              </p>
              <p className="post-headerSpecial">
                {`${props.pet.contact.address.address1 ? props.pet.contact.address.address1  + ', ' : ''}`}
                {props.pet.contact.address.city} {" "}
                {props.pet.contact.address.state}, {" "}
                {props.pet.contact.address.postcode}
              </p>

              <p className="post-headerSpecial">
              {props.pet.contact.phone ? props.pet.contact.phone: ""}
              {props.pet.contact.phone && props.pet.contact.email && " • "}
              {props.pet.contact.email ? props.pet.contact.email: ""}  
              </p>

            </div>
          )}
        </div>

      </div>




      {/* Reply Box */}
      {
        (showCommentBox || props.isModal) && (
          <div onClick={(e) => e.stopPropagation()}>
            <PostBox
              addPost={props.addPost}
              setComments={setComments}
              reply={true}
              postId={props._id}
              toggleCommentBox={toggleCommentBox} />
          </div>
        )
      }
    </div >
  );

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export default Post;
