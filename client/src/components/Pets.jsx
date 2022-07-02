import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/Pets.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Feed from "./Feed";
import PageLoading from "./PageLoading";
function Pets(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [startedBrowsing, setStartedBrowsing] = useState("");
  const [petFilters, setPetFilters] = useState({});
  const petFeed = useRef();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setStartedBrowsing(new Date().toISOString());
  }, []);

  // reset feed on filter change
  useEffect(() => {
    setPetFilters(props.petFilters);
    return () => {
      setStartedBrowsing(new Date().toISOString());
      setPets([]);
      setPage(1);
    };
  }, [props.petFilters]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let type = "";
    for (const key in petFilters) {
      if (petFilters[key]) {
        type = key;
      }
    }
    async function fetchPets() {
      isMounted && setIsLoading(true);
      try {
        const response = await axiosPrivate.get(
          `/api/pets?${new URLSearchParams({
            page: page,
            firstPostTime: startedBrowsing,
            type: type,
          })}`,
          {
            signal: controller.signal,
          }
        );
        if (response?.status == 200) {
          isMounted && setPets([...pets, ...response?.data?.data?.pets]);
        } else if (response?.status == 204) {
          isMounted && setEndReached(true);
        }
      } catch (error) {
        console.error(error);
      }
      isMounted && setIsLoading(false);
    }

    fetchPets();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, startedBrowsing, petFilters]);

  const onScroll = () => {
    if (petFeed.current) {
      const { scrollTop, scrollHeight, clientHeight } = petFeed.current;
      if (scrollTop + clientHeight === scrollHeight && !endReached) {
        if (!isLoading) {
          setPage(page + 1);
        }
      }
    }
  };

  return (
    <div className="pets" onScroll={onScroll} ref={petFeed}>
      <div className="pets-header">Pets</div>
      <Feed
        posts={pets}
        showModal={props.showModal}
        setProfileTab={props.setProfileTab}
      />
      {isLoading && <PageLoading />}
    </div>
    // </div>
  );
}

export default Pets;
