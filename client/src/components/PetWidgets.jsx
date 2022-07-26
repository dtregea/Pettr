import React, { useEffect, useReducer } from "react";
import "../styles/PetWidgets.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchBar from "./SearchBar";
function PetWidgets(props) {
  const speciesReducer = (state, action) => {
    switch (action.type) {
      case "none":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "cat":
        return {
          cat: !state.cat,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "dog":
        return {
          cat: false,
          dog: !state.dog,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "rabbit":
        return {
          cat: false,
          dog: false,
          rabbit: !state.rabbit,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "bird":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: !state.bird,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "smallAndFurry":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: !state.smallAndFurry,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "horse":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: !state.horse,
          scalesFinsAndOther: false,
          barnyard: false,
        };
      case "scalesFinsAndOther":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: !state.scalesFinsAndOther,
          barnyard: false,
        };
      case "barnyard":
        return {
          cat: false,
          dog: false,
          rabbit: false,
          bird: false,
          smallAndFurry: false,
          horse: false,
          scalesFinsAndOther: false,
          barnyard: !state.barnyard,
        };
      default:
        return {};
    }
  };

  const [speciesState, speciesDispatch] = useReducer(speciesReducer, {
    cat: false,
    dog: false,
    rabbit: false,
    bird: false,
    smallAndFurry: false,
    horse: false,
    scalesFinsAndOther: false,
    barnyard: false,
  });

  function isActive(type) {
    return speciesState[type];
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
  useEffect(() => {
    props.setPetFilters(speciesState);
  }, [speciesState]);

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
                  onClick={(e) => speciesDispatch({ type: e.target.value })}
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
