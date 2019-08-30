import React, { useState } from "react";
import "./create-new-user.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";

function CreateNewUser() {
  const initialData = {
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: ""
  };

  const [newAgent, setNewAgent] = useState(initialData);

  // form handler
  const handleChange = e => {
    setNewAgent({
      ...newAgent,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(newAgent);
    setNewAgent(initialData);
  };

  return (
    <React.Fragment>
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={3} className="align-self-stretch">
            <Sidebar />
          </Col>
          <Col md={9} className="right-part">
            <section className="invoice-wrap">
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="fname"
                      value={newAgent.fname}
                      onChange={handleChange}
                      required={true}
                      label="First Name *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lname"
                      value={newAgent.lname}
                      onChange={handleChange}
                      required={true}
                      label="Last Name *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      value={newAgent.email}
                      onChange={handleChange}
                      required={true}
                      label="Email *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phone"
                      value={newAgent.phone}
                      onChange={handleChange}
                      label="Phone"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="password"
                      value={newAgent.password}
                      onChange={handleChange}
                      required={true}
                      label="Password *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="confirmpassword"
                      value={newAgent.confirmpassword}
                      onChange={handleChange}
                      required={true}
                      label="Confirm Password *"
                    />
                  </Col>
                </Row>
                <div className="submit-button-area">
                  <Button variant="danger" type="submit">
                    SUBMIT
                  </Button>
                </div>
              </form>
            </section>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default CreateNewUser;
