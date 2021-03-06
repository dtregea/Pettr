import React from "react";
import Post from "./Post";
import "../styles/Modal.css";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import PostBox from "./PostBox";
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
          {props?.components?.header?.component && (
            <div className="modal-header">
              {props?.components?.header?.component === "Post" && (
                <div>
                  <Post
                    {...props.components.header.props}
                    setProfileTab={props.setProfileTab}
                    closeModal={props.onClose}
                  />
                </div>
              )}
            </div>
          )}
          <div className="modal-body">
            {props?.components?.body?.component === "Post" && (
              <Post
                {...props.components.body.props}
                setProfileTab={props.setProfileTab}
                closeModal={props.onClose}
                replyTo={props?.components?.header?.props?.user != null
                  ? `@${props?.components?.header?.props?.user?.username}`
                  : props?.components?.header?.props?.pet?.name}
              />
            )}
            {props?.components?.body?.component === "PostBox" && <PostBox />}
          </div>
          {props?.components?.footer?.component && (
            <div className="modal-footer">
              {props?.components?.footer?.component === "Feed" && (
                <Feed
                  {...props.components.footer.props}
                  setProfileTab={props.setProfileTab}
                  closeModal={props.onClose}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
}

export default Modal;
