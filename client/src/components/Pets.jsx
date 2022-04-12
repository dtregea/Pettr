import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../styles/Pets.css";
function Pets(props) {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const petFeed = useRef();

  async function fetchPets() {
    console.log("fetching page " + page);
    const response = await fetch(
      `http://localhost:5000/api/pets?${new URLSearchParams({
        page: page,
      })}`,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    if (response.status == 200) {
      const fetchedData = await response.json();
      if (fetchedData.data.animals) {
        console.log(fetchedData.data.animals);
        setPets([...pets, ...fetchedData.data.animals]);
      }
    } else if (response.status == 204) {
      setEndReached(true);
    }
  }

  useEffect(() => {
    fetchPets();
  }, [page]);

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
      <div className="feed">
        {pets.map((pet) => (
          <div key={pet._id}>
            <div>
              <div>
                {pet.name}: {pet.species}
              </div>
              <div>{pet.photos && <img src={pet.photos[0]}></img>}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pets;
