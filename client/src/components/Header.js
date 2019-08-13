import React from "react";
import logo from "./../assets/img/logo.png";

function Header() {
  return (
    <header className="cd-main-header">
      <a href="index.html" className="cd-logo">
        <img src={logo} alt="" className="logo-small" />
        Roadside Assistance
      </a>
      <a href="#" className="cd-nav-trigger">
        <span />
      </a>
      <nav className="cd-nav">
        <ul className="cd-top-nav">
          <li className="has-children account">
            <a href="#" className="refresh">
              <i className="fa fa-refresh" aria-hidden="true" />
            </a>
            <a href="#">
              Account <i className="fa fa-angle-down" aria-hidden="true" />
            </a>
            <ul>
              <li>
                <a href="#">Edit Account</a>
              </li>
              <li>
                <a href="#">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
