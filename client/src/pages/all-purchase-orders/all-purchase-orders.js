import React from "react";
import "./all-purchase-orders.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Row, Col, Button } from "react-bootstrap";

function AllPurchaseOrders() {
  return (
    <React.Fragment>
      <Header />
      <section className="content-area">
        <Sidebar />
        <div className="data-table-area">
          <header>
            <Row className="align-items-center">
              <Col xs={4}>
                <form className="form-inline">
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-danger my-2 my-sm-0" type="submit">
                    <i className="fa fa-search" aria-hidden="true" />
                  </button>
                </form>
              </Col>
              <Col className="text-right export">
                Export <i className="fa fa-share" aria-hidden="true" />
              </Col>
            </Row>
          </header>
          <div className="table-content">
            <header>
              <div className="check-box-area">
                <label className="custom-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </div>
              <div className="invoice">Invoice</div>
              <div className="fname">First Name</div>
              <div className="lname">Last Name</div>
              <div className="phone">Phone Number</div>
              <div className="service-type">Service Type</div>
              <div className="status">Status</div>
              <div className="amount">Amount</div>
              <div className="data-opened">Data Opened (Local Time)</div>
              <div className="dispatching-system">Dispatching System</div>
              <div className="edit" />
            </header>
            <div className="table-body">
              <div className="check-box-area">
                <label className="custom-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </div>
              <div className="invoice">374659725</div>
              <div className="fname">Andrew</div>
              <div className="lname">Johnson</div>
              <div className="phone">7363524284</div>
              <div className="service-type">Towing</div>
              <div className="status">PAID</div>
              <div className="amount">140.76</div>
              <div className="data-opened">Wed Jul 24 2019 17:23:35 GMT+0530</div>
              <div className="dispatching-system"><Button variant="danger">System1</Button></div>
              <div className="edit"><i className="fa fa-pencil" aria-hidden="true"></i></div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default AllPurchaseOrders;
