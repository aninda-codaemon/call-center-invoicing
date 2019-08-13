import React from "react";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Subheading from '../components/Subheading';

function Dashboard() {
  return (
    <section className="admin-body">
      <Header/>
      <main className="cd-main-content">
        <Sidebar/>
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
                <form>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Caller Info"/>
                    <div className="row">
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input type="text" id="fname" name="fname" required />
                          <label htmlFor="fname">
                            First Name*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input type="text" id="lname" name="lname" required />
                          <label htmlFor="lname">
                            Last Name*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-4 custom-input">
                        <div className="group">
                          <input type="tel" id="phone" name="phone" required />
                          <label htmlFor="phone">
                            Phone Number*
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Vehicle Info"/>
                    <div className="row">
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="number" id="year" name="year" required />
                          <label htmlFor="year">
                            Year*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="custom-select">
                          <select name="make" id="make">
                            <option defaultValue>
                            Make*
                            </option>
                            <option value="">Service 1</option>
                            <option value="">Service 2</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="model" name="model" required />
                          <label htmlFor="model">
                            Model*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="custom-select">
                          <select name="color" id="color">
                            <option defaultValue>
                            Color*
                            </option>
                            <option value="">Service 1</option>
                            <option value="">Service 2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Service Info"/>
                    <p className="small-heading">
                      Pricing may increase due to additional equipment needs
                    </p>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select name="servicetype" id="servicetype">
                            <option defaultValue>
                              Service Type*
                            </option>
                            <option value="">Service 1</option>
                            <option value="">Service 2</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select name="problemtype" id="problemtype">
                            <option defaultValue>
                              Problem Type*
                            </option>
                            <option value="">Service 1</option>
                            <option value="">Service 2</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select name="anyonewithvehicle" id="anyonewithvehicle">
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
                          <select name="havekeys" id="havekeys">
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
                          <select name="neutral" id="neutral">
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
                          <select name="wheelturn" id="wheelturn">
                            <option defaultValue>
                              Do all four wheels on the vehicle turn?
                              *
                            </option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Pickup-Drop Location"/>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="custom-select">
                          <select name="pickuplocation" id="pickuplocation">
                            <option defaultValue>
                              Pickup Location*
                            </option>
                            <option value="house">House</option>
                            <option value="business">Business</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="pickupnote" name="pickupnote" required />
                          <label htmlFor="pickupnote">
                            Pickup Note*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="origin" name="origin" required />
                          <label htmlFor="origin">Origin</label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="destination" name="destination" required />
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
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319"
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 dashboard-form-cont">
                    <Subheading text="Payment Info"/>
                    <div className="row">
                      <div className="col-sm-12 custom-input">
                        <div className="group">
                          <input type="email" id="email" name="email" required />
                          <label htmlFor="email">
                            Email*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="amount" name="amount" required />
                          <label htmlFor="amount">
                            Amount*
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6 custom-input">
                        <div className="group">
                          <input type="text" id="totalamount" name="totalamount" disabled />
                          <label htmlFor="totalamount">Total Amount</label>
                        </div>
                      </div>
                      <div className="col-sm-12 custom-input">
                        <div className="group">
                          <textarea rows="3" cols="50" id="notes" name="notes" placeholder="Notes">
                          </textarea>
                        </div>
                      </div>
                      <div className="col-sm-12 radio-cont">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="paymentPhone"
                            name="sendoption"
                            defaultChecked
                          />
                          <label htmlFor="paymentPhone">Phone</label>
                        </div>
                        <div className="form-check">
                          <input type="radio" id="paymentEmail" name="sendoption" />
                          <label htmlFor="paymentEmail">Email</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 buttons-cont">
                    <button className="btn refund-btn save-later-btn">
                      Save For Later
                    </button>
                    <button className="btn green-btn">Send Payment Link</button>
                    <button className="btn refund-btn reset-btn">Reset</button>
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
