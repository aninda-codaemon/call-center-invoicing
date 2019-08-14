import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Subheading from "../components/Subheading";

function Dashboard() {
  const initialData = {
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
    havekeys: "",
    neutral: "",
    wheelturn: "",
    pickuplocation: "",
    pickupnote: "",
    origin: "",
    destination: "",
    paymentemail: "",
    amount: 0,
    totalamount: 0,
    paymentnotes: "",
    sendoption: "phone"
  };

  const initialPrice = {
    cost: 0,
    basePrice: 0,
    aditionalPrice: 0
  };

  const [dData, setdData] = useState(initialData);
  const [price, setPrice] = useState(initialPrice);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(dData);
  };

  const handleChange = e => {
    setdData({
      ...dData,
      [e.target.name]: e.target.value
    });
  };

  const saveForm = () => {};

  const resetForm = () => {
    setdData({...initialData})
  };

  return (
    <section className="admin-body">
      <Header />
      <main className="cd-main-content">
        <Sidebar />
        <div className="dashboard-banner">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 text-center">
                <h1 className="heading">Roadside Assistance</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <section className="page page-dashboard">
            <div className="container-fluid">
              <div className="row">

                <form onSubmit={handleSubmit}>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Caller Info" />
                    <div className="row">
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={dData.fname}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="fname">First Name*</label>
                        </div>
                      </div>
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={dData.lname}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="lname">Last Name*</label>
                        </div>
                      </div>
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={dData.phone}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="phone">Phone Number*</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Vehicle Info" />
                    <div className="row">
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="number"
                            id="year"
                            name="year"
                            value={dData.year}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="year">Year*</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="custom-select">
                          <select
                            name="make"
                            id="make"
                            value={dData.make}
                            onChange={handleChange}
                          >
                            <option defaultValue >Make*</option>
                            <option value="AM General">AM General</option>
                            <option value="AMC">AMC</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="model"
                            name="model"
                            value={dData.model}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="model">Model*</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="custom-select">
                          <select
                            name="color"
                            id="color"
                            value={dData.color}
                            onChange={handleChange}
                          >
                            <option defaultValue>Color*</option>
                            <option value="beige">beige</option>
                            <option value="black">black</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Service Info" />
                    <p className="small-heading">
                      Pricing may increase due to additional equipment needs
                    </p>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="servicetype"
                            id="servicetype"
                            value={dData.servicetype}
                            onChange={handleChange}
                          >
                            <option defaultValue>Service Type*</option>
                            <option value="jump start">jump start</option>
                            <option value="lockout">lockout</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="problemtype"
                            id="problemtype"
                            value={dData.problemtype}
                            onChange={handleChange}
                          >
                            <option defaultValue>Problem Type*</option>
                            <option value="won't start">won't start</option>
                            <option value="belt broken">belt broken</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="anyonewithvehicle"
                            id="anyonewithvehicle"
                            value={dData.anyonewithvehicle}
                            onChange={handleChange}
                          >
                            <option defaultValue>
                              Will anyone be with the vehicle?*
                            </option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="havekeys"
                            id="havekeys"
                            value={dData.havekeys}
                            onChange={handleChange}
                          >
                            <option defaultValue>
                              Do you have keys for the vehicle?*
                            </option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="neutral"
                            id="neutral"
                            value={dData.neutral}
                            onChange={handleChange}
                          >
                            <option defaultValue>
                              Will the vehicle go in neutral?*
                            </option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="wheelturn"
                            id="wheelturn"
                            value={dData.wheelturn}
                            onChange={handleChange}
                          >
                            <option defaultValue>
                              Do all four wheels on the vehicle turn? *
                            </option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Pickup-Drop Location" />
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select
                            name="pickuplocation"
                            id="pickuplocation"
                            value={dData.pickuplocation}
                            onChange={handleChange}
                          >
                            <option defaultValue>Pickup Location*</option>
                            <option value="house">House</option>
                            <option value="business">Business</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="pickupnote"
                            name="pickupnote"
                            value={dData.pickupnote}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="pickupnote">Pickup Note*</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="origin"
                            name="origin"
                            value={dData.origin}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="origin">Origin</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={dData.destination}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="destination">Destination</label>
                        </div>
                      </div>
                    </div>
                    <button className="btn green-btn">Calculate Cost</button>
                    <div className="col-sm-12 price-section">
                      <p>
                        Cost: <b>$ 70.00</b>
                      </p>
                      <p>
                        Base Price: <b>$ 70.00</b>
                      </p>
                      <p>
                        Additional Price: <b>$ 0.00</b>
                      </p>
                    </div>
                    <div className="map-area">
                      <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319" />
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Payment Info" />
                    <div className="row">
                      <div className="col-sm-12 custom-input">
                        <div className="group">
                          <input
                            type="email"
                            id="paymentemail"
                            name="paymentemail"
                            value={dData.paymentemail}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="paymentemail">Email*</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="amount"
                            name="amount"
                            value={dData.amount}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="amount">Amount*</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input
                            type="text"
                            id="totalamount"
                            name="totalamount"
                            value={dData.totalamount}
                            onChange={handleChange}
                            disabled
                          />
                          <label htmlFor="totalamount">Total Amount</label>
                        </div>
                      </div>
                      <div className="col-sm-12 custom-input">
                        <div className="group">
                          <textarea
                            rows="3"
                            cols="50"
                            id="paymentnotes"
                            name="paymentnotes"
                            value={dData.paymentnotes}
                            onChange={handleChange}
                            placeholder="Notes"
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 radio-cont">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="paymentPhone"
                            name="sendoption"
                            value="phone"
                            onChange={handleChange}
                            defaultChecked
                          />
                          <label htmlFor="paymentPhone">Phone</label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="paymentEmail"
                            name="sendoption"
                            value="email"
                            onChange={handleChange}
                          />
                          <label htmlFor="paymentEmail">Email</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 buttons-cont">
                    <button
                      type="button"
                      className="btn refund-btn save-later-btn"
                      onClick={saveForm}
                    >
                      Save For Later
                    </button>
                    <button type="submit" className="btn green-btn">
                      Send Payment Link
                    </button>
                    <button
                      type="button"
                      className="btn refund-btn reset-btn"
                      onClick={resetForm}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default Dashboard;
