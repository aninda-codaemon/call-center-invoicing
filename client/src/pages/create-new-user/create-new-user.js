import React from "react";
import "./create-new-user.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";
import validate from "../../validation-rules/create-new-user-validation-rules";
import useForm from "../../custom-hooks/form-validation";

function CreateNewUser() {
  const { values, errors, handleChange, handleSubmit } = useForm(
    createNewUser,
    validate
  );

  function createNewUser() {
    console.log("No errors, submit callback called!");
  }

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
                      value={values.fname || ''}
                      onChange={handleChange}
                      required={true}
                      label="First Name *"
                    />
                    {errors.fname && <p className="error-text">{errors.fname}</p>}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lname"
                      value={values.lname || ''}
                      onChange={handleChange}
                      required={true}
                      label="Last Name *"
                    />
                    {errors.lname && <p className="error-text">{errors.lname}</p>}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      value={values.email || ''}
                      onChange={handleChange}
                      required={true}
                      label="Email *"
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phone"
                      value={values.phone || ''}
                      onChange={handleChange}
                      label="Phone"
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="password"
                      value={values.password || ''}
                      onChange={handleChange}
                      required={true}
                      label="Password *"
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="confirmpassword"
                      value={values.confirmpassword || ''}
                      onChange={handleChange}
                      required={true}
                      label="Confirm Password *"
                    />
                    {errors.confirmpassword && <p className="error-text">{errors.confirmpassword}</p>}
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
