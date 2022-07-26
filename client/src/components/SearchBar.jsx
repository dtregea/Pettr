import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/SearchBar.css";
function SearchBar(props) {
  const [usePassedSearch, setUsedPassedSearch] = useState(true);
  const [searchPhrase, setSearchPhrase] = useState('');
  const axiosPrivate = useAxiosPrivate();

  function setPhrase(event) {
    setUsedPassedSearch(false);
    setSearchPhrase(event.target.value);
  }

  async function search(event) {
    event.preventDefault();
    props.setSearchTab(searchPhrase || (usePassedSearch ? props.searchQuery : ''));
  }
  return (
    <div className="searchbar">
      <div className="form-icon-container">
        <SearchIcon className="search-icon" />
        <form onSubmit={search} className="search-form">
          <input
            className="searchbar-input"
            value={searchPhrase || (usePassedSearch ? props.searchQuery : '')}
            placeholder="Search Pettr"
            type="text"
            onChange={(e) => setPhrase(e)}
          ></input>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
