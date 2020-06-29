import React, { useContext, useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import "./headernav.scss";
import { Link, useHistory } from "react-router-dom";

import AuthContext from '../../context/auth/authContext';

function HeaderNav(props) {
  const authContext = useContext(AuthContext);
  const { topSpinner } = authContext;
  const spin = (topSpinner) ? 'fa-counter-spin' : '';

  // const handleRefresh = ()=>{
  //   window.location.reload();
  // }

  return (
    <ul className="headernav">
      {/* <li>
        <Link to="#" onClick={handleRefresh}><i className="fa fa-undo" aria-hidden="true" /></Link>
        
      </li> */}
      <li>
        <Dropdown alignRight>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Account <i className="fa fa-angle-down" aria-hidden="true" />
          </Dropdown.Toggle>
          
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/edit-account">
              Edit Account
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    </ul>
  );
}

export default HeaderNav;
