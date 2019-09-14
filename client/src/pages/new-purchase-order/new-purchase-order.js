import React, { useState, useEffect } from "react";
import Iframe from 'react-iframe';
import "./new-purchase-order.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button, Container, Modal } from "react-bootstrap";
import InnerBanner from "../../components/inner-banner/inner-banner";
import Input from "../../components/input/input";
import SelectOption from "../../components/select-option/select-option";
import AutoCompletePlaces from "./autocompleteplaces";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import {
  vehicle_make,
  vehicle_color,
  service_type,
  problem_type,
  pickup_location
} from "../../assets/data/staticdata";

//map import
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker
} from "react-google-maps";

import { compose, withProps, lifecycle } from "recompose";
import Axios from "../../custom-hooks/use-axios";

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
    paymentamount: 0,
    paymenttotalamount: 0,
    sendpaymentto: "phone"
  };

  // form state
  const [newData, setNewData] = useState(initialData);

  //cost calculation
  const [isCalculated, setIscalculated] = useState(false);

  //Places Auto complete Handler
  const latZipFinder = async (description, place) => {
    let currentData = newData;
    try {
      const allData = await geocodeByAddress(description);
      const latLng = await getLatLng(allData[0]);
      
      if (place === "origin") {
        currentData.originaddress = description;
        currentData.origin = latLng;
      } else {
        currentData.destinationaddress = description;
        currentData.destination = latLng;
      }
      
      //postcode
      allData[0].address_components.forEach(element => {
        if (element.types[0] === "postal_code") {
          place === "origin"
            ? (currentData.ozip = element.long_name)
            : (currentData.dzip = element.long_name);
          setNewData(currentData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  //onselect origin
  const onSelectPlaceOrigin = ({ description }) => {
    latZipFinder(description, "origin");
  };
  //onselect destination
  const onSelectPlaceDestination = ({ description }) => {
    latZipFinder(description, "destination");
  };

  //For empty object check
  const isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  const { google } = window;

  //Map...

  const MapWithADirectionsRenderer = compose(
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcZyvEkGx4i1cQlbiFvQBM8kM_x53__5M&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: (
        <div
          style={{
            height: `100%`
          }}
        />
      ),
      containerElement: (
        <div
          style={{
            height: `400px`
          }}
        />
      ),
      mapElement: (
        <div
          style={{
            height: `100%`
          }}
        />
      )
    }),
    withScriptjs,
    withGoogleMap,

    lifecycle({
      componentDidMount() {
        if (!isEmpty(newData.origin) && !isEmpty(newData.destination)) {
          const DirectionsService = new google.maps.DirectionsService();

          DirectionsService.route(
            {
              origin: newData.origin,
              destination: newData.destination,
              travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        }
      }
    })
  )(props => (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={
        new google.maps.LatLng(newData.origin.lat, newData.origin.lng)
      }
    >
      <Marker position={{ ...newData.origin }} />
      {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
  ));

  const generateMapUrl = () => {
    console.log(newData.destinationaddress);
    console.log(newData.originaddress);
    console.log(newData.servicetype); // === "Towing"
    const origin_address = newData.originaddress;
    const destination_address = newData.destinationaddress;
    let render_url = "";

    if (newData.servicetype === "Towing") {
      render_url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyCcZyvEkGx4i1cQlbiFvQBM8kM_x53__5M&origin=${encodeURI(origin_address)}&destination=${encodeURI(destination_address)}`;
    } else {
      render_url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCcZyvEkGx4i1cQlbiFvQBM8kM_x53__5M&q=${encodeURI(origin_address)}`;
    }

    return (
      <Iframe
        width="900"
        height="600"
        id="route_map"
        className="map-container"
        display="initial"
        url={render_url}
        />
    );
  }

  // form handler
  const handleChange = e => {
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
        setIscalculated(false);
        break;

      case "fueltype":
        e.target.value === "Diesel Gas"
          ? handleShow(
              "Service will not be performed, we cannot service diesel engines",
              "fuel"
            )
          : handleClose();
        break;

      case "fourwheelsturn":
        e.target.value === "No"
          ? fourwheelsToggle(true)
          : fourwheelsToggle(false);
        break;

      case "pickuplocation":
        e.target.value === "Highway"
          ? setCost({ ...cost, highway: 18 })
          : setCost({ ...cost, highway: 0 });
        break;

      case "keysforvehicle":
        e.target.value === "No"
          ? setCost({ ...cost, nokeys: 23 })
          : setCost({ ...cost, nokeys: 0 });
        break;

      case "neutral":
        e.target.value === "No"
          ? setCost({ ...cost, noneutral: 17 })
          : setCost({ ...cost, noneutral: 0 });
        break;

      case "frontwheelsturn":
        e.target.value === "No"
          ? setCost({ ...cost, nofrontwheelsturn: 26 })
          : setCost({ ...cost, nofrontwheelsturn: 0 });
        break;

      case "backwheelsturn":
        e.target.value === "No"
          ? setCost({ ...cost, nobackwheelsturn: 29 })
          : setCost({ ...cost, nobackwheelsturn: 0 });
        break;

      default:
    }

    setNewData({
      ...newData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(newData);
    setNewData({ ...initialData });
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
  const handleShow = (text, id) =>
    setModal({ ...modal, isShown: true, text, id });

  //modal for convert to towing
  const [towingModal, setTowingModal] = useState(false);
  const towingModalClose = () => setTowingModal(false);
  const towingModalShow = () => setTowingModal(true);
  const covertToTowing = () => {
    towingModalClose();
    setNewData({ ...newData, servicetype: "Towing" });
    towingToggle(true);
  };

  // serviceinfo state
  const initialServiceData = {
    fuelfluids: false,
    towing: false,
    fourwheelsturn: false
  };

  const [serviceInfo, setServiceInfo] = useState(initialServiceData);

  const fuelfluidsToggle = value => {
    setServiceInfo({
      ...initialServiceData,
      fuelfluids: value
    });
  };

  const towingToggle = value => {
    setServiceInfo({ ...serviceInfo, towing: value, fuelfluids: false });
  };

  const fourwheelsToggle = value => {
    setServiceInfo({ ...serviceInfo, fourwheelsturn: value });
  };

  //reset form data to initial state
  const resetForm = () => {
    setNewData({ ...initialData });
  };

  //cost calculation
  const initialCost = {
    highway: 0,
    nokeys: 0,
    noneutral: 0,
    nofrontwheelsturn: 0,
    nobackwheelsturn: 0,
    nobothwheelsturn: 0
  };

  const [cost, setCost] = useState(initialCost);

  const totalCost = obj => {
    let total = 0;
    for (let key in obj) {
      total += parseFloat(obj[key]);
    }
    // console.log(total);
    setNewData({ ...newData, additionalprice: total });
    return total;
  };

  const bothWheelsNotTurn = () => {
    if (cost.nofrontwheelsturn > 0 && cost.nobackwheelsturn > 0) {
      setCost({
        ...cost,
        nofrontwheelsturn: 0,
        nobackwheelsturn: 0,
        nobothwheelsturn: 39
      });
      totalCost(cost);
    } else {
      totalCost(cost);
    }
  };

  //post data creator
  const createPostData = (
    ozip,
    dzip,
    tmiles,
    servicetype,
    addlcharges,
    timestamp,
    lat,
    lng
  ) => {
    return {
      ozip,
      dzip,
      tmiles,
      servicetype: servicetype.toLowerCase(),
      addlcharges,
      timestamp,
      lat,
      lng
    };
  };

  //fetch data common method
  const commonFetchData = () => {
    let postData = createPostData(
      newData.ozip,
      newData.dzip,
      newData.tmiles,
      newData.servicetype,
      newData.additionalprice,
      "",
      newData.origin.lat,
      newData.origin.lng
    );

    const fetchData = async () => {
      let response = await Axios("api/order/pricing", postData, "post");
      let { data } = response.data;
      let currentData = { ...newData };
      if (data) {
        currentData.baseprice = data.base_price;
        currentData.calculatedcost = data.net_price;
        currentData.paymenttotalamount = data.total_price;
        currentData.paymentamount = data.net_price;
        setNewData({ ...currentData });
        setIscalculated(true);
      }
    };

    return fetchData();
  }

  //Calculate Cost
  const calculateCost = () => {
    //calculate Distance if service type is towing
    if (
      newData.servicetype === "Towing" &&
      !isEmpty(newData.origin) &&
      !isEmpty(newData.destination)
    ) {
      const DistanceService = new google.maps.DistanceMatrixService();
      DistanceService.getDistanceMatrix(
        {
          origins: [newData.origin],
          destinations: [newData.destination],
          travelMode: "DRIVING",
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (response, status) => {
          if (status === "OK") {
            if (response.rows[0].elements[0].status === "OK") {
              let distanceMeter = response.rows[0].elements[0].distance.value;
              let miles = (distanceMeter / 1600).toFixed(2);
              setNewData({ ...newData, tmiles: miles });
            }
          } else {
            alert("Error was: " + status);
          }
        }
      );
    }

    //calculate cost if only origin is present
    if (
      !isEmpty(newData.origin) &&
      isEmpty(newData.destination) &&
      newData.servicetype !== "Towing" &&
      newData.servicetype !== ""
    ) {
      commonFetchData();
    }
  };

  //cost calculation API call if service type is towing
  useEffect(() => {
    if (newData.tmiles) {
      commonFetchData();
    }
  }, [newData.tmiles]);

  useEffect(() => {
    bothWheelsNotTurn();
  }, [cost]);

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
                        required={true}
                        label="First Name *"
                      />
                    </Col>
                    <Col sm={6} lg={4}>
                      <Input
                        type="text"
                        name="lname"
                        value={newData.lname}
                        onChange={handleChange}
                        required={true}
                        label="Last Name *"
                      />
                    </Col>
                    <Col sm={6} lg={4}>
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
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="year"
                        value={newData.year}
                        onChange={handleChange}
                        required={true}
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
                        required={true}
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

                    {serviceInfo.towing && (
                      <Col xl={6}>
                        <SelectOption
                          label="Problem Type *"
                          name="problemtype"
                          value={newData.problemtype}
                          onChange={handleChange}
                          options={problem_type}
                        />
                      </Col>
                    )}

                    <Col xl={6}>
                      <SelectOption
                        label="Will anyone be with the vehicle? *"
                        name="anyonewithvehicle"
                        value={newData.anyonewithvehicle}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    <Col xl={6}>
                      <SelectOption
                        label="Do you have keys for the vehicle? *"
                        name="keysforvehicle"
                        value={newData.keysforvehicle}
                        onChange={handleChange}
                        options={["yes", "No"]}
                      />
                    </Col>

                    {serviceInfo.towing && (
                      <Col xl={6}>
                        <SelectOption
                          label="Will the vehicle go in neutral? *"
                          name="neutral"
                          value={newData.neutral}
                          onChange={handleChange}
                          options={["yes", "No"]}
                        />
                      </Col>
                    )}

                    {serviceInfo.towing && (
                      <Col xl={6}>
                        <SelectOption
                          label="Do all four wheels on the vehicle turn? *"
                          name="fourwheelsturn"
                          value={newData.fourwheelsturn}
                          onChange={handleChange}
                          options={["yes", "No"]}
                        />
                      </Col>
                    )}

                    {serviceInfo.fourwheelsturn && (
                      <Col xl={6}>
                        <SelectOption
                          label="Will both front wheels turn? *"
                          name="frontwheelsturn"
                          value={newData.frontwheelsturn}
                          onChange={handleChange}
                          options={["yes", "No"]}
                        />
                      </Col>
                    )}

                    {serviceInfo.fourwheelsturn && (
                      <Col xl={6}>
                        <SelectOption
                          label="Will both back wheels turn? *"
                          name="backwheelsturn"
                          value={newData.backwheelsturn}
                          onChange={handleChange}
                          options={["yes", "No"]}
                        />
                      </Col>
                    )}

                    {serviceInfo.fuelfluids && (
                      <Col xl={6}>
                        <SelectOption
                          label="Do you need regular gas or diesel? *"
                          name="fueltype"
                          value={newData.fueltype}
                          onChange={handleChange}
                          options={["regular gas", "diesel gas"]}
                        />
                      </Col>
                    )}
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
                      <AutoCompletePlaces
                        label="Origin"
                        onSelect={onSelectPlaceOrigin}
                      />
                    </Col>
                    <Col sm={6}>
                      {newData.servicetype === "Towing" && (
                        <AutoCompletePlaces
                          label="Destination"
                          onSelect={onSelectPlaceDestination}
                        />
                      )}
                    </Col>
                  </Row>

                  <div className="calculate-cost">
                    <Button
                      variant="info"
                      type="button"
                      onClick={calculateCost}
                    >
                      Calculate Cost
                    </Button>
                  </div>
                  {isCalculated && (
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
                  )}
                  {isCalculated && (
                    <div className="map-container">
                      {/* <MapWithADirectionsRenderer /> */}
                      { generateMapUrl() }
                    </div>
                  )}
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
                        value={`$ ${newData.paymentamount}`}
                        onChange={handleChange}
                        label="Amount *"
                      />
                    </Col>
                    <Col sm={6}>
                      <Input
                        type="text"
                        name="paymenttotalamount"
                        value={`$ ${newData.paymenttotalamount}`}
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
                        onClick={resetForm}
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

export default NewPurchaseOrder;
