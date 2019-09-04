import React, { useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";

function EditUser() {
  const initialValues = {
    fname: "John",
    lname: "Smith",
    email: "johnsmith@gmail.com",
    phone: "9865325686"
  };

  const [values, setValues] = useState(initialValues);

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
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
              <form onSubmit={handleSubmit} noValidate>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="fname"
                      value={values.fname}
                      onChange={handleChange}
                      label="First Name *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lname"
                      value={values.lname}
                      onChange={handleChange}
                      label="Last Name *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      label="Email *"
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      label="Phone"
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

export default EditUser;
