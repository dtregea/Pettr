import React, { useEffect, useRef } from "react";
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
import usePagination from "../hooks/usePagination";

function Modal(props) {
  const { modalLoading, closeModal } = useModal();

  const { addedPosts, addPost, clearPosts, removeAddedPost } = useAddPost();
  const [page, setPage] = useState(1);
  const { isLoading, results, hasNextPage, setIsLoading, deleteResult, setResults } = usePagination(
    page,
    "comments",
    `/api/posts/${props?.components?.body?.props?._id}/comments`,
    {},
    [props?.components?.body?.props?._id]
  );
  const comments = useRef();

  const onScroll = () => {
    if (comments.current) {
      const { scrollTop, scrollHeight, clientHeight } = comments.current;
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  // Reset added posts when a new post in modal is clicked
  useEffect(() => {
    clearPosts();
    setResults([]);
    setPage(1);
  }, [props?.components?.body?.props?._id])

  function deletePost(_id) {
    removeAddedPost(_id);
    deleteResult(_id);
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={closeModal} >
        {modalLoading && <PageLoading />}
        {!modalLoading && <div ref={comments} onScroll={onScroll} className="modal-content" onClick={(e) => e.stopPropagation()}>

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

            {/* Post Card */}
            {props?.components?.body?.component === "Post" && (

              <Post
                {...props.components.body.props}
                replyToName={props?.components?.header?.props?.user != null
                  ? `@${props?.components?.header?.props?.user?.username}`
                  : props?.components?.header?.props?.pet?.name}
                addPost={addPost}
              />
            )}

            {props?.components?.body?.component === "PostBox" && <PostBox />}
          </div>

          {/* Modal Footer */}
          {props?.components?.body?.component === "Post" && (results?.length > 0 || addedPosts?.length > 0) && (
            <div className="modal-footer"  >
              <div className="modal-header-text" >
                Replies
              </div>

              <Feed
                addedPosts={addedPosts}
                posts={results}
                deletePost={deletePost}
              />
              {isLoading && <PageLoading />}
            </div>)}
        </div>}

      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
}

export default Modal;
