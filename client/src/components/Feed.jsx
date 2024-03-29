import React from "react";
import "../styles/Feed.css";
import Post from "./Post";
import User from "./User";
function Feed(props) {
  return (
    <div className="feed">
      <div>
        {props.users?.map((user) =>
          <User
            key={user._id}
            {...user}
          />

        )}
      </div>
      <div>
        {props.addedPosts?.map((post) =>
          <Post
          key={post._id}
          {...post}
          deletePost={props.deletePost}
        />
        )}
      </div>
      <div>
        {props.posts?.map((post) => (
          <Post
            key={post._id}
            {...post}
            deletePost={props.deletePost}
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;
