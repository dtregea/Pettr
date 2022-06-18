import React from "react";
import "../styles/Search.css";
import Feed from "./Feed";
function Search(props) {
  return (
    <div className="search">
      <div className="search-header">
        <h2>Search Results</h2>
        {/* {props.searchResults.posts} */}

        <h3>Posts</h3>
        <Feed
          posts={props.searchResults.posts}
          showModal={props.showModal}
          setProfileTab={props.setProfileTab}
        />
        <h3>Pets</h3>
        <Feed
          posts={props.searchResults.pets}
          showModal={props.showModal}
          setProfileTab={props.setProfileTab}
        />
      </div>
    </div>
  );
}

export default Search;
