import React, { useEffect, useState, useRef } from "react";
import "../styles/Search.css";
import Feed from "./Feed";
import usePagination from "../hooks/usePagination";
import PageLoading from "./PageLoading";
import SearchBar from "./SearchBar";
import { useSearchParams } from "react-router-dom";


function Search(props) {
  const [searchParams, setSearchParams] = useSearchParams();
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
    typeToCollection[searchParams.get('type') == null ? 'post' : searchParams.get('type')],
    `/api/search`,
    {
      type: searchParams.get('type') ? searchParams.get('type') : '',
      query: searchParams.get('query') ? searchParams.get('query') : ''
    },
    [searchParams]
  );
  const search = useRef();

  // Reset Feed whenever filters or query change
  useEffect(() => {
    setStartedBrowsing(new Date().toISOString());
    setResults([]);
    setPage(1);
  }, [searchParams]);

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
        <SearchBar setSearchTab={props.setSearchTab} searchQuery={props.searchQuery} />
      </div>

      {searchParams.get('type') == 'user' && <Feed
        users={results}
      />}

      {(searchParams.get('type') == 'post' || searchParams.get('type') == 'pet') && <Feed
        posts={results}
      />}

      {isLoading && <PageLoading />}

      {!isLoading && !hasNextPage && (
        <div>You've reached the end!</div>
      )}

    </div>
  );
}

export default Search;
