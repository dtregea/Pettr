import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/SearchBar.css";
function SearchBar(props) {
  const [searchPhrase, setSearchPhrase] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  async function search(event) {
    event.preventDefault();
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/api/search?${new URLSearchParams({
          query: searchPhrase,
        })}`,
        {
          signal: controller.signal,
        }
      );
      if (response?.data?.status === "success") {
        props.setSearchTab(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="searchbar">
      <div className="form-icon-container">
        <SearchIcon className="search-icon" />

        <form onSubmit={search} className="search-form">
          <input
            className="searchbar-input"
            value={searchPhrase}
            placeholder="Search Pettr"
            type="text"
            onChange={(e) => setSearchPhrase(e.target.value)}
          ></input>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
