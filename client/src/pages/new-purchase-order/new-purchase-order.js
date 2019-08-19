import React from "react";
import "./new-purchase-order.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import InnerBanner from "../../components/inner-banner/inner-banner";

function NewPurchaseOrder() {
  return (
    <React.Fragment>
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            <InnerBanner/>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default NewPurchaseOrder;
