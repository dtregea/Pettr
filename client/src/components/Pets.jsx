import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/Pets.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Feed from "./Feed";
function Pets(props) {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [startedBrowsing, setStartedBrowsing] = useState("");
  const petFeed = useRef();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setStartedBrowsing(new Date().toISOString());
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPets() {
      console.log("fetching page " + page);
      try {
        console.log(pets[pets?.length - 1]?._id);
        const response = await axiosPrivate.get(
          `http://localhost:5000/api/pets?${new URLSearchParams({
            page: page,
            firstPostTime: startedBrowsing,
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
      controller.abort();
    };
  }, [page, startedBrowsing]);

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
      <div className="pets-header">pets</div>
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
