import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import DistanceMatrix from 'node-distance-matrix';

import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import InnerBanner from "../../components/inner-banner/inner-banner";
import Input from "../../components/input/input";
import SelectOption from "../../components/select-option/select-option";

import "./new-purchase-order.scss";

import Locationsearch from './places';

import {
  vehicle_make,
  vehicle_color,
  service_type,
  problem_type,
  pickup_location
} from "../../assets/data/staticdata";

import InvoiceContext from '../../context/invoice/invoiceContext';

const Purchaseorder = () => {
  const invoiceContext = useContext(InvoiceContext);

  const initialData = {
    invoicenumber: '1011290101',
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
    origin: {},
    originaddress: "",
    destination: {},
    destinationaddress: "",
    ozip: 0,
    dzip: 0,
    tmiles: 0,
    calculatedcost: 0,
    baseprice: 0,
    additionalprice: 0,
    paymentemail: "",
    paymentamount: '',
    paymenttotalamount: '',
    sendpaymentto: "Phone"
  };

  // Form state
  const [newData, setNewData] = useState(initialData);

  // Handle locations data
  const handleLocation = ({ description, latlng, place, zip_code }) => {
    console.log('Location Object');
    console.log(description, latlng, place, zip_code);

    if (place === 'origin') {
      setNewData({
        ...newData,
        originaddress: description,
        origin: latlng,
        ozip: zip_code
      });
    } else {
      setNewData({
        ...newData,
        destinationaddress: description,
        destination: latlng,
        dzip: zip_code
      });
    }
  }

  // Calculate cost button enable/disable toggle
  const [calculateCostDisable, setCalculateCostDisable] = useState(true);

  // Check conditions to check if calculate cost button should be enabled or disabled
  const checkCalculateCostBtnStatus = () => {
    console.log('Check btn status');
    if (newData.servicetype.length > 0) {
      console.log('Check btn status service type');
      setCalculateCostDisable(false);
    } else {
      setCalculateCostDisable(true);
    }
  }

  const handleChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  // Calculate cost button click
  const calculateDistance = async () => {
    try {
      const price = await invoiceContext.get_invoice_price(newData);
      console.log('Price calculation API');
      console.log(price);  
    } catch (error) {
      console.log('Price error');
      console.log(error);
    }
    
  }
  
  useEffect(() => {
    console.log('Use effect track newData changes');
    // Check if the newData changes
    checkCalculateCostBtnStatus();
  }, [newData]);

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
  const handleShow = (text, id) =>
    setModal({ ...modal, isShown: true, text, id });

  //modal for convert to towing
  const [towingModal, setTowingModal] = useState(false);
  const towingModalClose = () => setTowingModal(false);
  const towingModalShow = () => setTowingModal(true);
  const covertToTowing = () => {
    towingModalClose();
    // setNewData({ ...newData, servicetype: "Towing" });
    towingToggle(true);
  };

  const towingToggle = value => {
    setServiceInfo({ ...serviceInfo, towing: value, fuelfluids: false });
  };

  // serviceinfo state
  const initialServiceData = {
    fuelfluids: false,
    towing: false,
    fourwheelsturn: false
  };

  const [serviceInfo, setServiceInfo] = useState(initialServiceData);

  const fuelfluidsToggle = value => {
    const fuelData = serviceInfo;
    fuelData.fuelfluids = value;
    setServiceInfo(fuelData);
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
            {/* <InnerBanner /> */}
            <section className="invoice-wrap">
              <form onSubmit={handleSubmit} autoComplete="off">
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
                    <Col sm={6} lg={4}>
                      <Input
                        type="text"
                        name="fname"
                        value={newData.fname}
                        onChange={handleChange}
                        // required={true}
                        label="First Name *"
                      />                      
                    </Col>
                    <Col sm={6} lg={4}>
                      <Input
                        type="text"
                        name="lname"
                        value={newData.lname}
                        onChange={handleChange}
                        // required={true}
                        label="Last Name *"
                      />
                    </Col>
                    <Col sm={6} lg={4}>
                      <Input
                        type="tel"
                        name="phone"
                        value={newData.phone}
                        onChange={handleChange}
                        // required={true}
                        label="Phone Number *"
                      />
                    </Col>
                  </Row>
                </div>
                <div className="info-area">
                  <h2>Vehicle Info</h2>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="year"
                        value={newData.year}
                        onChange={handleChange}
                        // required={true}
                        label="Year *"
                      />                      
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Make *"
                        name="make"
                        value={newData.make}
                        onChange={handleChange}
                        options={vehicle_make}
                      />                      
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="model"
                        value={newData.model}
                        onChange={handleChange}
                        // required={true}
                        label="Model *"
                      />                      
                    </Col>
                    <Col sm={6}>
                      <SelectOption
                        label="Color *"
                        name="color"
                        value={newData.color}
                        onChange={handleChange}
                        options={vehicle_color}
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
                    <Col xl={6}>
                      <SelectOption
                        label="Service Type *"
                        name="servicetype"
                        value={newData.servicetype}
                        onChange={handleChange}
                        options={service_type}
                      />                      
                    </Col>
                    
                    <Col xl={6}>
                      <SelectOption
                        label="Will anyone be with the vehicle? *"
                        name="anyonewithvehicle"
                        value={newData.anyonewithvehicle}
                        onChange={handleChange}
                        options={["Yes", "No"]}
                      />
                    </Col>
                    
                    <Col xl={6}>
                      <SelectOption
                        label="Do you have keys for the vehicle? *"
                        name="keysforvehicle"
                        value={newData.keysforvehicle}
                        onChange={handleChange}
                        options={["Yes", "No"]}
                      />
                    </Col>

                    {
                      newData.servicetype === 'Fuel / Fluids' && (
                        <Col xl={6}>
                          <SelectOption
                            label="Do you need regular gas or diesel? *"
                            name="fueltype"
                            value={newData.fueltype}
                            onChange={handleChange}
                            options={["regular gas", "diesel gas"]}
                          />
                        </Col>
                      )
                    }                    

                    {newData.servicetype === 'Towing' && (
                        <React.Fragment>
                          <Col xl={6}>
                            <SelectOption
                              label="Problem Type *"
                              name="problemtype"
                              value={newData.problemtype}
                              onChange={handleChange}
                              options={problem_type}
                            />
                          </Col>

                          <Col xl={6}>
                            <SelectOption
                              label="Will the vehicle go in neutral? *"
                              name="neutral"
                              value={newData.neutral}
                              onChange={handleChange}
                              options={["Yes", "No"]}
                            />
                          </Col>

                          <Col xl={6}>
                            <SelectOption
                              label="Do all four wheels on the vehicle turn? *"
                              name="fourwheelsturn"
                              value={newData.fourwheelsturn}
                              onChange={handleChange}
                              options={["Yes", "No"]}
                            />
                          </Col>

                          {
                            newData.fourwheelsturn === 'No' && (
                              <React.Fragment>
                                <Col xl={6}>
                                  <SelectOption
                                    label="Will both front wheels turn? *"
                                    name="frontwheelsturn"
                                    value={newData.frontwheelsturn}
                                    onChange={handleChange}
                                    options={["Yes", "No"]}
                                  />
                                </Col>

                                <Col xl={6}>
                                  <SelectOption
                                    label="Will both back wheels turn? *"
                                    name="backwheelsturn"
                                    value={newData.backwheelsturn}
                                    onChange={handleChange}
                                    options={["Yes", "No"]}
                                  />
                                </Col>
                              </React.Fragment>
                            )
                          }                          
                        </React.Fragment>
                      )
                    }                    
                  </Row>
                </div>

                <div className="info-area">
                  <h2>Pickup-Drop Location</h2>
                  <Row>
                    <Col sm={6}>
                      <SelectOption
                        label="Pickup Location *"
                        name="pickuplocation"
                        value={newData.pickuplocation}
                        onChange={handleChange}
                        options={pickup_location}
                      />
                    </Col>
                    <Col sm={6}>
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
                    <Col sm={6}>
                      <Locationsearch value={newData.originaddress} place={'origin'} label="Origin" onSelect={handleLocation} />
                    </Col>
                    <Col sm={6}>                      
                      <Locationsearch value={newData.originaddress} place={'destination'} label="Destination" onSelect={handleLocation}/>
                    </Col>
                  </Row>

                  <div className="calculate-cost">
                    {
                      calculateCostDisable ? (
                        <Button
                          variant="info"
                          type="button"
                          disabled={true}              
                        >
                          Calculate Cost
                        </Button>
                      ) : (
                        <Button
                          variant="info"
                          type="button"
                          onClick={calculateDistance}                         
                        >
                          Calculate Cost
                        </Button>
                      )
                    }                      
                  </div>
                  
                    <React.Fragment>
                      <div className="cost-details">                        
                        <h3>
                          Distance: <strong>{newData.tmiles} miles</strong>
                        </h3>
                        <h3>
                          Cost: <strong>$ {newData.calculatedcost}</strong>
                        </h3>
                        <p>
                          Base Price: <strong>$ {newData.baseprice}</strong>
                        </p>
                        <p>
                          Additional Price:
                          <strong>$ {newData.additionalprice}</strong>
                        </p>
                      </div>                      
                    </React.Fragment>          
                    <div className="map-container">                      
                      {/* { generateMapUrl() } */}
                    </div>                  
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
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="paymentamount"
                        value={newData.paymentamount}
                        onChange={handleChange}                        
                        label="Amount *"
                      />                      
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="paymenttotalamount"
                        value={newData.paymenttotalamount}
                        label="Total Amount *"
                        readOnly="readOnly"
                      />                      
                    </Col>
                  </Row>
                  <div className="form-group">
                    <textarea
                      rows="4"
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
                            value="Phone"
                            checked={newData.sendpaymentto === "Phone"}
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
                            value="Email"
                            checked={newData.sendpaymentto === "Email"}
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
                    <Col lg={4}>
                      <Button variant="warning" type="button">
                        save for later
                      </Button>
                    </Col>
                    <Col lg={4}>
                      <Button variant="info" type="submit">
                        send payment link
                      </Button>
                    </Col>
                    <Col lg={4}>
                      <Button
                        variant="danger"
                        type="button"
                        
                      >
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

export default Purchaseorder;