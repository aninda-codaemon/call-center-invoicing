import React from "react";
import { Dropdown } from "react-bootstrap";
import "./headernav.scss";

function HeaderNav() {
  return (
    <ul className="headernav">
      <li>
        <i className="fa fa-undo" aria-hidden="true" />
      </li>
      <li>
        <Dropdown alignRight>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Account <i className="fa fa-angle-down" aria-hidden="true" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Edit Account</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    </ul>
  );
}

export default HeaderNav;
