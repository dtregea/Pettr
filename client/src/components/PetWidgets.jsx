import React, { useState } from "react";
import "../styles/PetWidgets.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchBar from "./SearchBar";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
function PetWidgets(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [zipCode, setZipCode] = useState('');
  function isActive(type) {
    return searchParams.get('type') == type;
  }

  function setZip(value) {
    console.log(value.charAt(value.length - 1));
    if (value == '' || !Number.isNaN(parseInt(value.charAt(value.length - 1)))) {
      setZipCode(value);
    }
  }

  function setParams(event) {
    event.preventDefault();
    let zipLength = zipCode.toString().length;
    if (zipLength !== 0 && zipLength < 5) {
      toast.error('Zip code must be 5 numbers');
      return;
    }
    searchParams.set('location', zipCode);
    setSearchParams(searchParams);
  }

  const keyToCheckbox = {
    none: "Clear Animal Type",
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
      <div className="filters">
        <div className="dropdown">
          <DropdownButton
            as={ButtonGroup}
            title={searchParams.get('type') ? keyToCheckbox[searchParams.get('type')] : 'Animal Type'}
            id={`dropdown-button-drop-0`}
          >
            <Dropdown.Item>
              <ListGroup className="list-group">
                {Object.keys(keyToCheckbox).map((key) => (
                  <ListGroup.Item
                    className={`${isActive(key) ? "active" : ""}`}
                    value={key}
                    action
                    onClick={(e) => {
                      searchParams.set('type', e.target.value == 'none' ? '' : e.target.value);
                      setSearchParams(searchParams)
                    }}
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
        <form className="filter-input-form" onSubmit={setParams}>
          <input
            className="filter-input"
            maxLength='5'
            value={zipCode}
            placeholder="Zip Code"
            type="text"
            onChange={(e) => setZip(e.target.value)}
          ></input>
        </form>
      </div>


    </div>
  );
}

export default PetWidgets;
