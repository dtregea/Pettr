import React, { useState, useEffect, useRef } from "react";
import "../styles/Pets.css";
import Feed from "./Feed";
import PageLoading from "./PageLoading";
import usePagination from "../hooks/usePagination";
function Pets(props) {
  const [startedBrowsing, setStartedBrowsing] = useState(new Date().toISOString());
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [petFilters, setPetFilters] = useState({});
  const { isLoading, results, hasNextPage, setResults, setIsLoading } =
    usePagination(page, startedBrowsing, "pets", `/api/pets`, { type }, [type]);
  const petFeed = useRef();

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

  // Reset Feed whenever filters change
  useEffect(() => {
    if (!shallowEqual(petFilters, props.petFilters)) {
      setStartedBrowsing(new Date().toISOString());
      setResults([]);
      setPage(1);
      setPetFilters(props.petFilters);
    }
  }, [props.petFilters]);

  // Set the type of animal to query for as the pet with the 'true' petfilter value
  useEffect(() => {
    let filterFound = false;
    for (const key in petFilters) {
      if (petFilters[key]) {
        setType(key);
        filterFound = true;
      }
    }
    if (!filterFound) {
      setType("");
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
