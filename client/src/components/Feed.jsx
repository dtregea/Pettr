import React, { useEffect, useState } from "react";
import "../styles/Feed.css";
import PostBox from "./PostBox";
import Post from "./Post";

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let route = props.isPostModal
      ? `/api/posts/${props.postId}/comments`
      : `/api/users/${localStorage.getItem("id")}/feed`;
    async function fetchPosts() {
      const response = await fetch(`http://localhost:5000${route}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const fetchedData = await response.json();
      if (fetchedData) {
        setPosts(
          props.isPostModal ? fetchedData.data.comments : fetchedData.data.posts
        );
      }
    }
    fetchPosts();
  }, [props.isPostModal, props.postId]);

  return (
    <div className="feed">
      {/* Header */}

      {!props.isPostModal && (
        <div className="feed-header">
          <h2>Home</h2>
        </div>
      )}

      {/* Post Box */}
      {!props.isPostModal && <PostBox />}

      {posts.map((post) => (
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
          showPostModal={props.showPostModal}
        />
      ))}
    </div>
  );
}

export default Feed;
