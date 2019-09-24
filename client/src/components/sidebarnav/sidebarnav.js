import React, { useContext, useEffect } from "react";
import "./sidebarnav.scss";
import { NavLink } from "react-router-dom";

import AuthContext from '../../context/auth/authContext';

function SidebarNav() {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const loadUserMenu = () => {
    if (user && user.role_id === 1) {
      return (
        <li>
          <NavLink activeClassName="active" to="/users">
            <i className="fa fa-phone" aria-hidden="true" /> Users
            </NavLink>
        </li>
      );
    }
  }
  
  useEffect(() => {
    loadUserMenu();
  }, [user]);

  return (
    <ul className="sidebarnav">
      <li>
        <NavLink activeClassName="active" to="/all-purchase-orders">
          <i className="fa fa-file-text-o" aria-hidden="true" /> All Purchase
          Orders
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/new-purchase-order">
          <i className="fa fa-plus-square-o" aria-hidden="true" /> New Purchase
          Order
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/refund-request">
          <i className="fa fa-scissors" aria-hidden="true" /> Refund Request
        </NavLink>
      </li>
      { loadUserMenu() }      
    </ul>
  );
}

export default SidebarNav;
