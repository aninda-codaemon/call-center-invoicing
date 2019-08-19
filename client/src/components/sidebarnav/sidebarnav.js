import React from "react";
import "./sidebarnav.scss";

function SidebarNav() {
  return (
    <ul className="sidebarnav">
      <li className="active">
        <i className="fa fa-file-text-o" aria-hidden="true" /> All Purchase
        Orders
      </li>
      <li>
        <i className="fa fa-plus-square-o" aria-hidden="true" /> New Purchase
        Order
      </li>
      <li>
        <i className="fa fa-scissors" aria-hidden="true" /> Refund Request
      </li>
      <li>
        <i className="fa fa-phone" aria-hidden="true" /> Call Agents
      </li>
    </ul>
  );
}

export default SidebarNav;
