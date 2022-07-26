import React, { useEffect, useState, useRef } from "react";
import "../styles/Search.css";
import Feed from "./Feed";
import usePagination from "../hooks/usePagination";
import PageLoading from "./PageLoading";
import SearchBar from "./SearchBar";
function Search(props) {
  const [type, setType] = useState('post'); // Type of posts to filter for
  const [query, setQuery] = useState(props.searchQuery); // Search phrase to search for
  const [searchFilters, setSearchFilters] = useState({}); // Filter state passed in from Search Widgets
  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString()); // Time user started searching
  const [page, setPage] = useState(1); // Page of results to retrieve

  const typeToCollection = {
    post: "posts",
    pet: "posts",
    user: "users"
  }
  const { isLoading, results, hasNextPage, setIsLoading, setResults } = usePagination(
    page,
    startedBrowsing,
    typeToCollection[type],
    `/api/search`,
    { type, query },
    [type, query]
  );
  const search = useRef();


  // Shallow comparison of two objects
  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  // Reset Feed whenever filters or query change
  useEffect(() => {
    let change = false;

    if (props.searchQuery !== query) {
      console.log("query changed");
      change = true;
      setQuery(props.searchQuery);
    }

    if(!shallowEqual(searchFilters, props.searchFilters)) {
      console.log("filters changed");
      setSearchFilters(props.searchFilters);
      change = true;
    }
    if (change) {
      setStartedBrowsing(new Date().toISOString());
      setResults([]);
      setPage(1);
    }
  }, [props.searchQuery, props.searchFilters]);

  // Set the type of result to query for as the result with the 'true' searchfilter value
  useEffect(() => {
    let filterFound = false;
    for (const key in searchFilters) {
      console.log("checking " ,key, searchFilters[key]);
      if (searchFilters[key]) {
        setType(key);
        filterFound = true;
      }
    }
    if (!filterFound) {
      setType("post");
    }
  }, [searchFilters]);

  const onScroll = () => {
    if (search.current) {
      const { scrollTop, scrollHeight, clientHeight } = search.current;
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div className="search" onScroll={onScroll} ref={search}>
      <div className="header">
        Search Results
      </div>

      <div className="explore-searchbar">
        <SearchBar setSearchTab={props.setSearchTab} searchQuery={props.searchQuery}/>
      </div>

      {type == 'user' && <Feed
        users={results}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />}

      {(type == 'post' || type == 'pet') && <Feed
        posts={results}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />}

      {isLoading && <PageLoading />}
      {!hasNextPage && "You've reached the end!"}

    </div>
  );
}

export default Search;
