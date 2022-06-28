import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/Pets.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Feed from "./Feed";
function Pets(props) {
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
      console.log("fetching page " + page);
      try {
        const response = await axiosPrivate.get(
          `http://localhost:5000/api/pets?${new URLSearchParams({
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
    }

    fetchPets();
    return () => {
      isMounted = false;
      //setPets([]);
      controller.abort();
    };
  }, [page, startedBrowsing, petFilters]);

  const onScroll = () => {
    if (petFeed.current) {
      const { scrollTop, scrollHeight, clientHeight } = petFeed.current;
      if (scrollTop + clientHeight === scrollHeight && !endReached) {
        setPage(page + 1);
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
    </div>
    // </div>
  );
}

export default Pets;
