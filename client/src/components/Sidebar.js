import React from "react";

function Sidebar() {
  return (
    <nav className="cd-side-nav">
      <ul>
        <li className="tickets">
          <a>
            <i className="fa fa-truck" aria-hidden="true" /> All Purchase Orders
          </a>
        </li>
        <li className="customer-order">
          <a>
            <i className="fa fa-truck" aria-hidden="true" /> New Purchase Order
          </a>
        </li>
        <li className="customer-order">
          <a>
            <i className="fa fa-money" aria-hidden="true" /> Refund Request
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
