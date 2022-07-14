import React, { useEffect, useReducer } from "react";
import "../styles/PetWidgets.css";
function PetWidgets(props) {
  const speciesReducer = (state, action) => {
    switch (action.type) {
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

  function toggleCheckbox(e) {
    console.log("dispatching " + e.target.value);
    speciesDispatch({ type: e.target.value });
  }

  function isOtherSpeciesSelected(species) {
    for (let key in speciesState) {
      if (speciesState[key] === true && key !== species) {
        return true;
      }
    }
    return false;
  }

  function camelCaseToSentenceCase(str) {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
      .trim();
  }

  return (
    <div className="pet-widgets">
      {Object.keys(speciesState).map((key) => (
        <div className="pet-widgets-checkbox" key={key}>
          <div className="checkbox-text">{camelCaseToSentenceCase(key)} </div>
          <div>
            <input
              className="pet-checkbox"
              type="checkbox"
              value={key}
              onClick={(e) => toggleCheckbox(e)}
              disabled={!speciesState[key] && isOtherSpeciesSelected(key)}
            />
          </div>
        </div>
      ))}

      <div>
        <button onClick={() => props.setPetFilters(speciesState)}>save</button>
      </div>
    </div>
  );
}

export default PetWidgets;
