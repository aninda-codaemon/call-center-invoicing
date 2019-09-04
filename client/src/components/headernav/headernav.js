import React from "react";
import { Dropdown } from "react-bootstrap";
import "./headernav.scss";
import { Link } from "react-router-dom";

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
            <Dropdown.Item as={Link} to="/edit-account">
              Edit Account
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    </ul>
  );
}

export default HeaderNav;
