import React, { useEffect, useReducer } from "react";
import "../styles/PetWidgets.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchBar from "./SearchBar";
function SearchWidgets(props) {

  const searchReducer = (state, action) => {
    switch (action.type) {
      case "post":
        return {
          pet: false,
          post: true,
          user: false
        };
      case "pet":
        return {
          pet: true,
          post: false,
          user: false
        };
      case "user":
        return {
          pet: false,
          post: false,
          user: true
        };
      default:
        return {};
    }
  };

  const [searchState, searchDispatch] = useReducer(searchReducer, {
    pet: false,
    post: true,
    user: false
  });

  const keyToCheckbox = {
    post: "Posts",
    pet: "Pets",
    user: "Users",
  };
  function isActive(type) {
    return searchState[type];
  }

  useEffect(() => {
    props.setSearchFilters(searchState);
  }, [searchState]);
  return (
    <div className="pet-widgets">
      <div className="pet-widgets-searchbar">
        <SearchBar setSearchTab={props.setSearchTab} searchQuery={props.searchQuery} />
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
                  onClick={(e) => searchDispatch({ type: e.target.value })}
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