import React, { useState } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";
import validate from "../../validation-rules/edit-account-validation-rules";

function EditAccount() {
  const initialValues = {
    fname: "John",
    lname: "Smith",
    email: "johnsmith@gmail.com",
    phone: "9865325686",
    password: "",
    confirmpassword: ""
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    switch (e.target.name) {
      case "password":
        if (e.target.value.length > 5) setErrors({ ...errors, password: "" });
        break;
      case "confirmpassword":
        if (e.target.value.length > 5) {
          setErrors({ ...errors, confirmpassword: "" });
        }
        break;
      default:
    }
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors(validate(values));
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
                      label="First Name *"
                      readOnly={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lname"
                      value={values.lname}
                      label="Last Name *"
                      readOnly={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      value={values.email}
                      label="Email *"
                      readOnly={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      label="Phone"
                      readOnly={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      required={true}
                      label="Password *"
                    />
                    {errors.password && (
                      <p className="error-text">{errors.password}</p>
                    )}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handleChange}
                      required={true}
                      label="Confirm Password *"
                    />
                    {errors.confirmpassword && (
                      <p className="error-text">{errors.confirmpassword}</p>
                    )}
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

export default EditAccount;
