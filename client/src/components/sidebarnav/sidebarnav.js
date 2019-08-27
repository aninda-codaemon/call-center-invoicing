import React from "react";
import "./sidebarnav.scss";
import { NavLink } from "react-router-dom";

function SidebarNav() {
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
      <li>
      <NavLink activeClassName="active" to="/call-agents">
        <i className="fa fa-phone" aria-hidden="true" /> Call Agents
        </NavLink>
      </li>
    </ul>
  );
}

export default SidebarNav;
