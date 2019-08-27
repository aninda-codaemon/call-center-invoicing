import React, { useState } from "react";
import "./new-purchase-order.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container, Modal } from "react-bootstrap";
import InnerBanner from "../../components/inner-banner/inner-banner";
import Input from "../../components/input/input";
import SelectOption from "../../components/select-option/select-option";

function NewPurchaseOrder() {
  const initialData = {
    invoicenumber: 647003561,
    fname: "",
    lname: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    color: "",
    servicetype: "",
    problemtype: "",
    anyonewithvehicle: "",
    keysforvehicle: "",
    fourwheelsturn: "",
    frontwheelsturn: "",
    backwheelsturn: "",
    neutral: "",
    fueltype: "",
    pickuplocation: "",
    pickupnotes: "",
    origin: "",
    destination: "",
    calculatedcost: 0,
    baseprice: 0,
    additionalprice: 0,
    paymentemail: "",
    paymentamount: undefined,
    paymenttotalamount: undefined,
    sendpaymentto: "phone"
  };

  // form state
  const [newData, setNewData] = useState(initialData);

  // form handler
  const handleChange = e => {
    console.log('hi');
    switch (e.target.name) {
      case "anyonewithvehicle":
        e.target.value === "No"
          ? handleShow(
              "Service will not be performed on unattended vehicles",
              "noOne"
            )
          : handleClose();
        break;

      case "servicetype":
        if (e.target.value === "Fuel / Fluids") {
          fuelfluidsToggle(true);
        } else if (e.target.value === "Towing") {
          towingToggle(true);
        } else {
          setServiceInfo(initialServiceData);
        }
        break;

      case "fueltype":
        e.target.value === "Diesel Gas"
          ? handleShow(
              "Service will not be performed, we cannot service diesel engines",
              "fuel"
            )
          : handleClose();
        break;
    }

    setNewData({
      ...newData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(newData);
    setNewData(initialData);
  };

  // modal state
  const initModalData = {
    isShown: false,
    text: "",
    id: ""
  };

  const [modal, setModal] = useState(initModalData);

  // modal handler
  const handleClose = () => {
    if (modal.id === "fuel") {
      setModal(initModalData);
      towingModalShow();
    } else {
      setModal(initModalData);
    }
  };
  const handleShow = (text, id) => setModal({ ...modal, isShown: true, text, id });

  //modal for convert to towing
  const [towingModal, setTowingModal] = useState(false);
  const towingModalClose = () => setTowingModal(false);
  const towingModalShow = () => setTowingModal(true);
  const covertToTowing = () => {
    towingModalClose();
    setNewData({...newData, servicetype: "Towing"});
  };

  // serviceinfo state
  const initialServiceData = {
    fuelfluids: false,
    towing: false,
    fourwheelsturn: false
  };

  const [serviceInfo, setServiceInfo] = useState(initialServiceData);

  const fuelfluidsToggle = value => {
    setServiceInfo({ ...serviceInfo, fuelfluids: value, towing: false });
  };

  const towingToggle = value => {
    setServiceInfo({ ...serviceInfo, towing: value, fuelfluids: false });
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
            <InnerBanner />
            <section className="invoice-wrap">
              <form onSubmit={handleSubmit}>
                <div className="invoice-title">
                  <Input
                    type="text"
                    name="invoicenumber"
                    value={newData.invoicenumber}
                    readOnly="readOnly"
                    label="Invoice #"
                  />
                </div>
                <div className="info-area">
                  <h2>Caller Info</h2>
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="fname"
                        value={newData.fname}
                        onChange={handleChange}
                        required={true}
                        label="First Name *"
                      />
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        name="lname"
                        value={newData.lname}
                        onChange={handleChange}
                        required={true}
                        label="Last Name *"
                      />
                    </Col>
                    <Col>
                      <Input
                        type="tel"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChange}
                        required={true}
                        label="Phone Number *"
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Vehicle Info</h2>
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="year"
                        value={newData.year}
                        onChange={handleChange}
                        required={true}
                        label="Year *"
                      />
                    </Col>
                    <Col>
                      <SelectOption
                        label="Make *"
                        name="make"
                        value={newData.make}
                        onChange={handleChange}
                        options={[
                          "AM General",
                          "AMC",
                          "Acura",
                          "Alfa Romeo",
                          "Aston Martin",
                          "Audi",
                          "BACKDRAFT",
                          "BMW",
                          "Bentley",
                          "Buick",
                          "Cadillac",
                          "Chevrolet",
                          "Chrysler",
                          "Daewoo"
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="model"
                        value={newData.model}
                        onChange={handleChange}
                        required={true}
                        label="Model *"
                      />
                    </Col>
                    <Col>
                      <SelectOption
                        label="Color *"
                        name="color"
                        value={newData.color}
                        onChange={handleChange}
                        options={[
                          "Beige",
                          "Black",
                          "Blue",
                          "Brown",
                          "Burgundy",
                          "Champagne",
                          "Gold",
                          "Gray",
                          "Gray Violet",
                          "Green",
                          "Light Blue",
                          "Light Brown",
                          "Light Gray",
                          "Light Green"
                        ]}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Service Info</h2>
                  <h4>
                    Pricing may increase due to additional equipment needs
                  </h4>
                  <Row>
                    <Col sm={6}>
                      <SelectOption
                        label="Service Type *"
                        name="servicetype"
                        value={newData.servicetype}
                        onChange={handleChange}
                        options={[
                          "Fuel / Fluids",
                          "Jump Start",
                          "Lockout",
                          "Towing",
                          "Tire Change"
                        ]}
                      />
                    </Col>
                    <Col sm={6} hidden={!serviceInfo.towing}>
                      <SelectOption
                        label="Problem Type *"
                        name="problemtype"
                        value={newData.problemtype}
                        onChange={handleChange}
                        options={[
                          "Won't Start",
                          "Belt Broken",
                          "Brakes",
                          "Engine Fire",
                          "Engine Problem",
                          "Fuel System Problem",
                          "Head / Brake lights",
                          "Ignition Problems",
                          "Items Hanging",
                          "Key Stuck In Ignition",
                          "Multiple Tire / No Spare",
                          "Oil / Fuel Leak",
                          "Overheating",
                          "Stuck in Park / Gear",
                          "Tire Pressure Low",
                          "Transmission Problem",
                          "Vandalism",
                          "Windshield (Cracked / Broken)",
                          "Other"
                        ]}
                      />
                    </Col>

                    <Col sm={6}>
                      <SelectOption
                        label="Will anyone be with the vehicle? *"
                        name="anyonewithvehicle"
                        value={newData.anyonewithvehicle}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6}>
                      <SelectOption
                        label="Do you have keys for the vehicle? *"
                        name="keysforvehicle"
                        value={newData.keysforvehicle}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6} hidden={!serviceInfo.towing}>
                      <SelectOption
                        label="Will the vehicle go in neutral? *"
                        name="fueltype"
                        value={newData.neutral}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6} hidden={!serviceInfo.towing}>
                      <SelectOption
                        label="Do all four wheels on the vehicle turn? *"
                        name="fourwheelsturn"
                        value={newData.fourwheelsturn}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6} hidden={!serviceInfo.fourwheelsturn}>
                      <SelectOption
                        label="Will both front wheels turn? *"
                        name="frontwheelsturn"
                        value={newData.frontwheelsturn}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6} hidden={!serviceInfo.fourwheelsturn}>
                      <SelectOption
                        label="Will both back wheels turn? *"
                        name="backwheelsturn"
                        value={newData.backwheelsturn}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col sm={6} hidden={!serviceInfo.fuelfluids}>
                      <SelectOption
                        label="Do you need regular gas or diesel? *"
                        name="fueltype"
                        value={newData.fueltype}
                        onChange={handleChange}
                        options={["regular gas", "diesel gas"]}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Pickup-Drop Location</h2>
                  <Row>
                    <Col>
                      <SelectOption
                        label="Pickup Location *"
                        name="pickuplocation"
                        value={newData.pickuplocation}
                        onChange={handleChange}
                        options={["House", "Business", "Highway", "Apartment"]}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        name="pickupnotes"
                        value={newData.pickupnotes}
                        onChange={handleChange}
                        label="Pickup Note"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="origin"
                        value={newData.origin}
                        onChange={handleChange}
                        label="Origin"
                      />
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        name="destination"
                        value={newData.destination}
                        onChange={handleChange}
                        label="Destination"
                      />
                    </Col>
                  </Row>
                  <div className="calculate-cost">
                    <Button variant="info" type="button">
                      Calculate Cost
                    </Button>
                  </div>
                  <div className="cost-details">
                    <h3>
                      Cost: <strong>$ {newData.calculatedcost}</strong>
                    </h3>
                    <p>
                      Base Price: <strong>$ {newData.baseprice}</strong>
                    </p>
                    <p>
                      Additional Price:{" "}
                      <strong>$ {newData.additionalprice}</strong>
                    </p>
                  </div>
                  <iframe
                    title="myFrame"
                    className="map"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14736.363660571635!2d88.35306525!3d22.57570275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1566830445871!5m2!1sen!2sin"
                  />
                </div>

                <div className="info-area">
                  <h2>Payment Info</h2>
                  <Input
                    type="email"
                    name="paymentemail"
                    value={newData.paymentemail}
                    onChange={handleChange}
                    label="Email *"
                  />
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="paymentamount"
                        value={newData.paymentamount}
                        onChange={handleChange}
                        label="Amount *"
                      />
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        name="paymenttotalamount"
                        value={newData.paymenttotalamount}
                        onChange={handleChange}
                        label="Total Amount *"
                        readOnly="readOnly"
                      />
                    </Col>
                  </Row>
                  <div className="form-group">
                    <textarea
                      name="paymentnotes"
                      className="textarea"
                      value={newData.paymentnotes}
                      placeholder="Notes"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="send-payment-link">
                    <p>Send payment link to</p>
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
                            checked={newData.sendpaymentto === "phone"}
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
                            checked={newData.sendpaymentto === "email"}
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
                </div>

                <div className="buttons-area">
                  <Row>
                    <Col>
                      <Button variant="warning" type="button">
                        save for later
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="info" type="submit">
                        send payment link
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="danger" type="button">
                        reset
                      </Button>
                    </Col>
                  </Row>
                </div>
              </form>
            </section>
          </Col>
        </Row>
      </Container>

      {/* alert for no one with the vehicle and diesel gas */}

      <Modal show={modal.isShown} onHide={handleClose} className="error-bg">
        <i
          className="fa fa-times-circle close-icon"
          aria-hidden="true"
          onClick={handleClose}
        ></i>
        <Modal.Body className="text-center">{modal.text}</Modal.Body>
      </Modal>

      {/* alert for convert the service type into Towing */}

      <Modal show={towingModal} onHide={handleClose} className="error-bg">
        <i
          className="fa fa-times-circle close-icon"
          aria-hidden="true"
          onClick={handleClose}
        ></i>
        <Modal.Body className="text-center">
          Press OK button to convert the service type into Towing!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={towingModalClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={covertToTowing}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default NewPurchaseOrder;
