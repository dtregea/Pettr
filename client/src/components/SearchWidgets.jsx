import React from "react";
import "../styles/PetWidgets.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchBar from "./SearchBar";

import { useSearchParams } from "react-router-dom";

function SearchWidgets() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyToCheckbox = {
    post: "Posts",
    pet: "Pets",
    user: "Users",
  };

  function isActive(type) {
    return searchParams.get('type') == type;
  }

  return (
    <div className="pet-widgets">
      <div className="pet-widgets-searchbar">
        <SearchBar />
      </div>
      <h2 className="filter-label">
        Filter Search Results
      </h2>
      <div className="dropdown">
        <DropdownButton
          as={ButtonGroup}
          title={"Select Filter"}
          id={`dropdown-button-drop-0`}
        >
          <Dropdown.Item>
            <ListGroup className="list-group">
              {Object.keys(keyToCheckbox).map((key) => (
                <ListGroup.Item
                  className={`${isActive(key) ? "active" : ""}`}
                  value={key}
                  action
                  onClick={(e) => setSearchParams({ type: e.target.value, query: searchParams.get('query') })}
                  key={key}
                  active={isActive(key)}
                >
                  {keyToCheckbox[key]}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  )
}

export default SearchWidgets