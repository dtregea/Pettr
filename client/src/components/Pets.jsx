import React, { useState, useEffect, useRef, useDebugValue } from "react";
import "../styles/Pets.css";
import Feed from "./Feed";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
import { useSearchParams } from "react-router-dom";

function Pets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString());
  const [page, setPage] = useState(1);
  const { isLoading, results, hasNextPage, setResults, setIsLoading } =
    usePagination(
      page,
      "pets",
      `/api/pets`,
      {
        type: searchParams.get('type'),
        location: searchParams.get('location'),
        startedBrowsing,
      },
      [searchParams]);
  const petFeed = useRef();


  // Reset Feed whenever filters change
  useEffect(() => {
    setStartedBrowsing(new Date().toISOString());
    setResults([]);
    setPage(1);
  }, [searchParams]);


  const onScroll = () => {
    if (petFeed.current) {
      const { scrollTop, scrollHeight, clientHeight } = petFeed.current;
      if (scrollTop + clientHeight >= scrollHeight - 500 && hasNextPage) {
        if (!isLoading) {
          setIsLoading(true);
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div className="pets fadeIn" onScroll={onScroll} ref={petFeed}>
      <div className="header">Pets</div>
      <Feed
        posts={results}
      />
      {!isLoading && !hasNextPage && (
        <div>You've reached the end!</div>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Pets;
