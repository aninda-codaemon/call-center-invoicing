import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const AutoCompletePlaces = ({label, onSelect}) => {
  return (
    <React.Fragment>
      <GooglePlacesAutocomplete
        onSelect = {onSelect}
        renderInput={props => (
          <div className="form-group">
            <input className="float-input" {...props} filled="true" autoComplete="false" />
            <label>{label}</label>
          </div>
        )}
      />
    </React.Fragment>
  );
};

export default AutoCompletePlaces;
