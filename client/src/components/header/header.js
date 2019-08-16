import React from "react";
import "./header.scss";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import logo from "../../assets/img/logo.png";

function Header() {
  return (
    <header className="main-header">
      <Container fluid={true}>
        <Row className="align-items-center">
          <Col xs={7}>
            <figure className="logo">
              <img src={logo} alt="logo" className="img-fluid" />
              <figcaption>Roadside Assistance</figcaption>
            </figure>
          </Col>
          <Col xs={5}>
            <ul className="top-right">
              <li>
                <i className="fa fa-undo" aria-hidden="true" />
              </li>
              <li>
                <Dropdown alignRight>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Account{" "}
                    <i className="fa fa-angle-down" aria-hidden="true" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">
                      Edit Account
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Header;
