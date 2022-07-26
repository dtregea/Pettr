import React from "react";
import "../styles/Feed.css";
import Post from "./Post";
import User from "./User";
//accepts posts and showModal
function Feed(props) {
  return (
    <div className="feed">
      <div>
        {props.users?.map((user) =>
          <User
            key={user._id}
            _id={user._id}
            isFollowed={user.isFollowed}
            displayname={user.displayname}
            username={user.username}
            bio={user.bio}
            avatar={user.avatar}
            setProfileTab={props.setProfileTab}

          />

        )}
      </div>
      <div>
        {props.posts?.map((post) => (
          <Post
            key={post._id}
            _id={post._id}
            user={post.user}
            text={post.content}
            images={post.images}
            trendingView={post.trendingView}
            timestamp={post.timestamp}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            repostCount={post.repostCount}
            isLiked={post.isLiked}
            isReposted={post.isReposted}
            repostedBy={post.repostedBy}
            showModal={props.showModal}
            setProfileTab={props.setProfileTab}
            isModalReply={props.isModalReply}
            closeModal={props.closeModal}
            pet={post.pet}
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;
