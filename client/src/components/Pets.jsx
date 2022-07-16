import React, { useState, useEffect, useRef } from "react";
import "../styles/Pets.css";
import Feed from "./Feed";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";

function Pets(props) {
  const [page, setPage] = useState(1);
  const [startedBrowsing, setStartedBrowsing] = useState(
    new Date().toISOString()
  );
  const [type, setType] = useState("");
  const [petFilters, setPetFilters] = useState({});
  const { isLoading, results, hasNextPage, setResults, setIsLoading } =
    usePagination(page, startedBrowsing, "pets", `/api/pets`, { type }, [
      startedBrowsing,
      type,
    ]);
  const petFeed = useRef();

  // reset feed on filter change
  useEffect(() => {
    setPetFilters(props.petFilters);
    return () => {
      setStartedBrowsing(new Date().toISOString());
      setResults([]);
      setPage(1);
    };
  }, [props.petFilters]);

  useEffect(() => {
    for (const key in petFilters) {
      if (petFilters[key]) {
        setType(key);
      }
    }
  }, [petFilters]);

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
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />
      {isLoading && <PageLoading />}
    </div>
  );
}

export default Pets;
