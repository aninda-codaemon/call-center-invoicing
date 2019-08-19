import React from "react";
import "./sortingicon.scss";

function SortingIcon() {
  return (
    <div className="sortingicon">
      <p>
        <i className="fa fa-caret-up" aria-hidden="true" />
      </p>
      <p>
        <i className="fa fa-caret-down" aria-hidden="true" />
      </p>
    </div>
  );
}

export default SortingIcon;
