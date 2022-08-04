import React, { useEffect } from "react";
import Post from "./Post";
import "../styles/Modal.css";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import PostBox from "./PostBox";
import Feed from "./Feed";
import useModal from "../hooks/useModal";
import PageLoading from "./PageLoading";
import useAddPost from "../hooks/useAddPost";
import { useState } from "react";
function Modal(props) {
  const { modalLoading, closeModal } = useModal();
  const { addedPosts, addPost, clearPosts, removeAddedPost } = useAddPost();
  const [replies, setReplies] = useState([]);


  useEffect(() => {
    setReplies(props?.components?.footer?.props?.posts);
  }, [props?.components?.footer?.props?.posts])

  // Reset added posts when a new post in modal is clicked
  useEffect(() => {
    clearPosts();
  }, [props])

  function deletePost(_id) {
    removeAddedPost(_id);
    setReplies(replies.filter(post => {
      return post._id != _id;
    }));
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={closeModal}>
        {modalLoading && <PageLoading />}
        {!modalLoading && <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          {/* Modal header */}
          {props?.components?.header?.component && (
            <div className="modal-header">
              {props?.components?.header?.component === "Post" && (
                <div>
                  <Post
                    {...props.components.header.props}
                  />
                </div>
              )}
            </div>
          )}
          <div className="modal-body">

            {/* Modal Body */}
            {props?.components?.body?.component === "Post" && (
              <Post
                {...props.components.body.props}
                replyTo={props?.components?.header?.props?.user != null
                  ? `@${props?.components?.header?.props?.user?.username}`
                  : props?.components?.header?.props?.pet?.name}
                addPost={addPost}
              />
            )}

            {props?.components?.body?.component === "PostBox" && <PostBox />}
          </div>

          {/* Modal Footer */}
          {(props?.components?.footer?.component || addedPosts) && (
            <div className="modal-footer">
              <Feed
                addedPosts={addedPosts}
                // {...props?.components?.footer?.props}
                posts={replies}
                deletePost={deletePost}
              />
            </div>
          )}
        </div>}

      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
}

export default Modal;
