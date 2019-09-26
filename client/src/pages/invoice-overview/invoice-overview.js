import React, { useState, useEffect, useContext } from "react";
import "./invoice-overview.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container } from "react-bootstrap";
import Input from "../../components/input/input";
import SelectOption from "../../components/select-option/select-option";
import {
  vehicle_make,
  vehicle_color,
  service_type,
  problem_type,
  pickup_location
} from "../../assets/data/staticdata";

import InvoiceContext from '../../context/invoice/invoiceContext';
import Invoiceform from './invoice-show';

function InvoiceOverview(props) {
  const invoiceContext = useContext(InvoiceContext);
  const invoice_id = props.match.params.invoice_id;

  const { invoice } = invoiceContext;
  
  const showOverview = () => {
    if (invoice !== null) {
      return <Invoiceform />;
    } else {
      return <div>Loading.....</div>
    }
  }
  
  useEffect(() => {
    invoiceContext.get_invoice_info(invoice_id);
  }, []);

  // For unmount
  useEffect( () => () => {
    invoiceContext.clear_invoice();
    console.log("unmount invoice overview");
  }, [] );

  return (
    <React.Fragment>
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={3} className="align-self-stretch">
            <Sidebar />
          </Col>
          <Col md={9} className="right-part">
            { showOverview() }
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default InvoiceOverview;
