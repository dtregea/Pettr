import React, { useEffect, useState } from "react";
import "../styles/Feed.css";
import PostBox from "./PostBox";
import Post from "./Post";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        `http://localhost:5000/api/users/${localStorage.getItem("id")}/feed`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const fetchedData = await response.json();
      if (fetchedData) {
        const postKeys = Object.keys(fetchedData.data.posts);
        const newPostsObj = fetchedData.data.posts; // object containing objects
        const newCountsObj = fetchedData.data.counts; // object containing objects
        let newPostsArr = [];
        postKeys.forEach((key, index) => {
          newPostsArr.push({
            id: newPostsObj[key]._id,
            user: newPostsObj[key].user,
            text: newPostsObj[key].content,
            image:
              newPostsObj[key].images == null ? [] : newPostsObj[key].images[0],
            trendingView: false,
            timestamp: newPostsObj[key].createdAt,
            likeCount: newCountsObj[key].likeCount,
            commentCount: newCountsObj[key].commentCount,
            repostCount: newCountsObj[key].repostCount,
          });
        });
        setPosts(newPostsArr);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      {/* Header */}

      <div className="feed-header">
        <h2>Home</h2>
      </div>

      {/* Post Box */}
      <PostBox />

      {posts.map((post) => (
        <Post
          key={post.id}
          user={post.user}
          text={post.text}
          image={post.image}
          trendingView={post.trendingView}
          timestamp={post.createdAt}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          repostCount={post.repostCount}
        />
      ))}
    </div>
  );
}

export default Feed;
