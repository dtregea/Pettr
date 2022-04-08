import React from "react";
import "../styles/Feed.css";
import Post from "./Post";
//accepts posts and showModal
function Feed(props) {
  return (
    <div className="feed">
      {props.posts.map((post) => (
        <Post
          key={post._id}
          _id={post._id}
          user={post.user}
          text={post.content}
          image={post.image}
          trendingView={post.trendingView}
          timestamp={post.createdAt}
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
        />
      ))}
    </div>
  );
}

export default Feed;
