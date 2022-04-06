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
          <div className="modal-body">
            {props.components.body &&
              props.components.body.component === "Post" && (
                <Post {...props.components.body.props} />
              )}
            {props.components.body &&
              props.components.body.component === "PostBox" && <PostBox />}
          </div>
          <div className="modal-footer">
            {props.components.footer &&
              props.components.footer.component === "Feed" && (
                <Feed {...props.components.footer.props} />
              )}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
}

export default Modal;
