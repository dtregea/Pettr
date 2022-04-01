import React from "react";
import Post from "./Post";
import "../styles/Modal.css";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Feed from "./Feed";
function Modal(props) {
  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={props.onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body">
            <Post
              key={props.post._id}
              _id={props.post._id}
              user={props.post.user}
              text={props.post.text}
              image={props.post.image}
              trendingView={false}
              timestamp={props.post.createdAt}
              likeCount={props.post.likeCount}
              commentCount={props.post.commentCount}
              repostCount={props.post.repostCount}
              isLiked={props.post.isLiked}
              isReposted={props.post.isReposted}
              repostedBy={props.post.repostedBy}
              isModal={true}
            />
          </div>
          <div className="modal-footer">
            <Feed isPostModal={true} postId={props.post._id} />
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
}

export default Modal;
