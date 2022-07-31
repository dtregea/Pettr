import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/SearchBar.css";
import { useEffect } from "react";

function SearchBar(props) {
  let navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [usePassedSearch, setUsedPassedSearch] = useState(true);
  const [searchPhrase, setSearchPhrase] = useState('');

  useEffect(() => {
    if (searchParams.get('query')) {
      setSearchPhrase(searchParams.get('query'));
    }
  }, [])

  function setPhrase(event) {
    setUsedPassedSearch(false);
    setSearchPhrase(event.target.value);
  }

  async function search(event) {
    event.preventDefault();
    let type = searchParams.get('type');

    // Automatically set type parameter if not already on the search page
    if (!location.pathname.includes('search')) {
      if (location.pathname.includes('pets')) {
        type = 'pet';
      } else if (location.pathname.includes('explore') || location.pathname.includes('home')) {
        type = 'post';
      } else {
        type = 'post';
      }
    }
    navigate(`/search?` + new URLSearchParams({ query: searchPhrase, type }))
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
