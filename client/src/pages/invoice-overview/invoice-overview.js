import React, { useState } from "react";
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

function InvoiceOverview() {
  const [invoiceData, setInvoiceData] = useState({});

  const handleSubmit = e => {
    e.preventDefault();
    console.log(invoiceData);
    setInvoiceData({});
  };

  const handleChange = e => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value
    });
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
              <div className="alert-area">
                Submit this purchase order into DISPATCHING SYSTEM
                {invoiceData.systemnumber || 1}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="info-area">
                  <h2>Invoice Overview</h2>
                  <Row>
                    <Col sm={6} lg={4}>
                      <Input
                        type="text"
                        name="invoicenumber"
                        value={invoiceData.invoicenumber || 51029482}
                        onChange={handleChange}
                        label="Invoice"
                      />
                    </Col>
                    <Col sm={6} lg={4}>
                      <SelectOption
                        label="Status"
                        name="paymentstatus"
                        value={invoiceData.paymentstatus || "Yet_to_pay"}
                        onChange={handleChange}
                        options={[
                          "YET_TO_PAY",
                          "VISITED",
                          "PAID",
                          "DISPATCHED"
                        ]}
                      />
                    </Col>
                    <Col sm={6} lg={4}>
                      <Input
                        type="text"
                        name="amount"
                        value={`$ ${invoiceData.amount || 0}`}
                        onChange={handleChange}
                        label="Amount"
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Contact Information</h2>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="fname"
                        value={invoiceData.fname || "John"}
                        onChange={handleChange}
                        label="First Name"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="lname"
                        value={invoiceData.lname || "Doe"}
                        onChange={handleChange}
                        label="Last Name"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="tel"
                        name="phone"
                        value={invoiceData.phone || "7738224354"}
                        onChange={handleChange}
                        label="Phone Number"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="email"
                        name="email"
                        value={invoiceData.email || "johndoe@yahoo.com"}
                        onChange={handleChange}
                        label="Email"
                      />
                    </Col>
                  </Row>
                  <div className="send-payment-link invoice">
                    <Row>
                      <Col>
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="paymenttophone"
                            name="sendpaymentto"
                            onChange={handleChange}
                            value="phone"
                            checked={
                              invoiceData.sendpaymentto === undefined
                                ? true
                                : invoiceData.sendpaymentto === "phone"
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="paymenttophone"
                          >
                            Phone
                          </label>
                        </div>
                      </Col>
                      <Col>
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="paymenttoemail"
                            name="sendpaymentto"
                            onChange={handleChange}
                            value="email"
                            checked={invoiceData.sendpaymentto === "email"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="paymenttoemail"
                          >
                            Email
                          </label>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="resend-buttons-area">
                    <Button variant="info" type="button">
                      resend receipt
                    </Button>
                    <Button variant="danger" type="button">
                      resend pay link
                    </Button>
                  </div>
                </div>
                <div className="info-area">
                  <h2>Vehicle Info</h2>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="year"
                        value={invoiceData.year || "2019"}
                        onChange={handleChange}
                        label="Year"
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Make"
                        name="make"
                        value={invoiceData.make || "Dodge"}
                        onChange={handleChange}
                        options={vehicle_make}
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="model"
                        value={invoiceData.model || "Charger"}
                        onChange={handleChange}
                        label="Model"
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Color"
                        name="color"
                        value={invoiceData.color || "Black"}
                        onChange={handleChange}
                        options={vehicle_color}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Service Info</h2>
                  <Row>
                    <Col sm={6}>
                      <SelectOption
                        label="Service Type"
                        name="servicetype"
                        value={invoiceData.servicetype || "Towing"}
                        onChange={handleChange}
                        options={service_type}
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Problem Type"
                        name="problemtype"
                        value={invoiceData.problemtype || "Engine Problem"}
                        onChange={handleChange}
                        options={problem_type}
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Will anyone be with the vehicle?"
                        name="anyonewithvehicle"
                        value={invoiceData.anyonewithvehicle || "Yes"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Do you have keys for the vehicle?"
                        name="keysforvehicle"
                        value={invoiceData.keysforvehicle || "Yes"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Will the vehicle go in neutral?"
                        name="neutral"
                        value={invoiceData.neutral || "Yes"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Do all four wheels on the vehicle turn?"
                        name="fourwheelsturn"
                        value={invoiceData.fourwheelsturn || "No"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                    <Col xl={6}>
                      <SelectOption
                        label="Will both front wheels turn?"
                        name="frontwheelsturn"
                        value={invoiceData.frontwheelsturn || "No"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                    <Col xl={6}>
                      <SelectOption
                        label="Will both back wheels turn?"
                        name="backwheelsturn"
                        value={invoiceData.backwheelsturn || "Yes"}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Location Information</h2>
                  <Row>
                    <Col sm={6}>
                      <SelectOption
                        label="Pickup Location"
                        name="pickuplocation"
                        value={invoiceData.pickuplocation || "House"}
                        onChange={handleChange}
                        options={pickup_location}
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="pickupnotes"
                        value={
                          invoiceData.pickupnotes ||
                          "Vehicle is in front driveway."
                        }
                        onChange={handleChange}
                        label="Pickup Note"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="origin"
                        value={
                          invoiceData.origin || "123 Main St, Dallas, TX 75240"
                        }
                        onChange={handleChange}
                        label="Origin"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="destination"
                        value={
                          invoiceData.destination ||
                          "456 Alpha St, Frisco, TX 78482"
                        }
                        onChange={handleChange}
                        label="Destination"
                      />
                    </Col>
                  </Row>
                  <div className="form-group notes">
                    <label>Notes</label>
                    <textarea
                      rows="4"
                      name="paymentnotes"
                      className="textarea"
                      value={
                        invoiceData.paymentnotes ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                      }
                      placeholder="Notes"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="info-area">
                  <h2>Time Stamps</h2>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="dateopened"
                        value={invoiceData.dateopened || "10/08/2019"}
                        onChange={handleChange}
                        label="Date Opened"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="timeofpayment"
                        value={invoiceData.timeofpayment || "07:20 P.M."}
                        onChange={handleChange}
                        label="Time of Payment"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="fpaymentlinksent"
                        value={invoiceData.fpaymentlinksent || "11/08/2019"}
                        onChange={handleChange}
                        label="First time payment link was sent"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="lpaymentlinksent"
                        value={invoiceData.lpaymentlinksent || "13/08/2019"}
                        onChange={handleChange}
                        label="Last time payment link was sent"
                      />
                    </Col>
                  </Row>
                  <div className="resend-buttons-area">
                    <Button variant="info" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </section>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default InvoiceOverview;
