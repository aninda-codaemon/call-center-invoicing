import React from "react";
import "./select-option.scss";

function SelectOption(props) {
  const toProperCase = str => {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div className="form-group">
      <select
        className="custom-select"
        name={props.name}
        id={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        <option hidden>{props.label}</option>
        {props.options.map((option, index) => {
          return (
            <option key={index} value={toProperCase(option)}>
              {toProperCase(option)}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SelectOption;
