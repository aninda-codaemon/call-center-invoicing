import React from "react";
import "./sidebar.scss";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li className="active"><i className="fa fa-file-text-o" aria-hidden="true"></i> All Purchase Orders</li>
        <li><i className="fa fa-plus-square-o" aria-hidden="true"></i> New Purchase Order</li>
        <li><i className="fa fa-scissors" aria-hidden="true"></i> Refund Request</li>
        <li><i className="fa fa-phone" aria-hidden="true"></i> Call Agents</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
