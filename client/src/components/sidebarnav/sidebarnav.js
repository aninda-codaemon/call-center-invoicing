import React, { useContext, useEffect, Fragment } from "react";
import "./sidebarnav.scss";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth/authContext";

function SidebarNav() {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const loadUserMenu = () => {
    if (user && user.role_id === 1) {
      return (
        <li>
          <NavLink activeClassName="active" to="/users">
            <i className="fa fa-phone" aria-hidden="true" />
            <span>Users</span>
          </NavLink>
        </li>
      );
    }
  };

  useEffect(() => {
    loadUserMenu();
  }, [user]);

  return (
    <Fragment>
      <div className="navToggleIcon">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
      </div>
      {/* <ul className="sidebarnav icon-only"> */}
      <ul className="sidebarnav">
        <li>
          <NavLink activeClassName="active" to="/all-purchase-orders">
            <i className="fa fa-file-text-o" aria-hidden="true" />
            <span>All Purchase Orders</span>
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/new-purchase-order">
            <i className="fa fa-plus-square-o" aria-hidden="true" />
            <span>New Purchase Order</span>
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/refund-request">
            <i className="fa fa-scissors" aria-hidden="true" />
            <span>Refund Request</span>
          </NavLink>
        </li>
        {loadUserMenu()}
      </ul>
    </Fragment>
  );
}

export default SidebarNav;
