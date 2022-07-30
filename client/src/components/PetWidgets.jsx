import React from "react";
import "../styles/PetWidgets.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchBar from "./SearchBar";
import {useSearchParams } from "react-router-dom";
function PetWidgets(props) {
  const [searchParams, setSearchParams] = useSearchParams();

  function isActive(type) {
    return searchParams.get('type') == type;
  }

  const keyToCheckbox = {
    none: "Clear Filter",
    cat: "Cats",
    dog: "Dogs",
    rabbit: "Rabbits",
    bird: "Birds",
    smallAndFurry: "Small and Furry",
    horse: "Horse",
    scalesFinsAndOther: "Scales, Fins, and Others",
    barnyard: "Barnyard",
  };

  return (
    <div className="pet-widgets">
      <div className="pet-widgets-searchbar">
        <SearchBar setSearchTab={props.setSearchTab} searchQuery={props.searchQuery} />
      </div>
      <h2 className="filter-label">
        Filter Animals
      </h2>
      <div className="dropdown">
        <DropdownButton
          as={ButtonGroup}
          title={"Select Animal"}
          id={`dropdown-button-drop-0`}
        >
          <Dropdown.Item>
            <ListGroup className="list-group">
              {Object.keys(keyToCheckbox).map((key) => (
                <ListGroup.Item
                  className={`${isActive(key) ? "active" : ""}`}
                  value={key}
                  action
                  onClick={(e) => setSearchParams({ type: e.target.value == 'none' ? '' : e.target.value})}
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
  );
}

export default PetWidgets;
