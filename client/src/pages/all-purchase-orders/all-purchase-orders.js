import React from "react";
import "./all-purchase-orders.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import Pagination from "../../components/pagination/pagination";
import SortingIcon from "../../components/sortingicon/sortingicon";
import { Row, Col, Button, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';

function AllPurchaseOrders() {
  return (
    <React.Fragment>
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={3} className="align-self-stretch">
            <Sidebar />
          </Col>
          <Col md={9} className="right-part">
            <div className="data-table-area">
              <header>
                <Row className="align-items-center">
                  <Col md={8}>
                    <form className="search-area">
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                      />
                      <button
                        className="btn btn-danger my-2 my-sm-0"
                        type="submit"
                      >
                        <i className="fa fa-search" aria-hidden="true" />
                      </button>
                    </form>
                  </Col>
                  <Col className="text-right export">
                    Export <i className="fa fa-share" aria-hidden="true" />
                  </Col>
                </Row>
              </header>
              <div className="hr-scroll">
                <div className="table-content">
                  <header>
                    <div className="check-box-area">
                      <label className="custom-checkbox">
                        <input type="checkbox" />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="invoice">Invoice <SortingIcon/></div>
                    <div className="fname">First Name <SortingIcon/></div>
                    <div className="lname">Last Name <SortingIcon/></div>
                    <div className="phone">Phone Number <SortingIcon/></div>
                    <div className="service-type">Service Type <SortingIcon/></div>
                    <div className="status">Status <SortingIcon/></div>
                    <div className="amount">Amount <SortingIcon/></div>
                    <div className="data-opened">Data Opened (Local Time) <SortingIcon/></div>
                    <div className="dispatching-system">Dispatching System <SortingIcon/></div>
                    <div className="edit">&nbsp;</div>
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
                    <div className="status paid">paid</div>
                    <div className="amount">140.76</div>
                    <div className="data-opened">
                      Wed Jul 24 2019 17:23:35 GMT+0530
                    </div>
                    <div className="dispatching-system">
                      <Button variant="danger" size="sm">
                        System1
                      </Button>
                    </div>
                    <div className="edit">
                      <Link to="/invoice-overview"><i className="fa fa-pencil" aria-hidden="true" /></Link>
                    </div>
                  </div>
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
                    <div className="status dispatched">dispatched</div>
                    <div className="amount">140.76</div>
                    <div className="data-opened">
                      Wed Jul 24 2019 17:23:35 GMT+0530
                    </div>
                    <div className="dispatching-system">
                      <Button variant="danger" size="sm">
                        System1
                      </Button>
                    </div>
                    <div className="edit">
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  </div>
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
                    <div className="status yet-to-pay">yet to pay</div>
                    <div className="amount">140.76</div>
                    <div className="data-opened">
                      Wed Jul 24 2019 17:23:35 GMT+0530
                    </div>
                    <div className="dispatching-system">
                      <Button variant="danger" size="sm">
                        System1
                      </Button>
                    </div>
                    <div className="edit">
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  </div>
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
                    <div className="status visited">visited</div>
                    <div className="amount">140.76</div>
                    <div className="data-opened">
                      Wed Jul 24 2019 17:23:35 GMT+0530
                    </div>
                    <div className="dispatching-system">
                      <Button variant="primary" size="sm">
                        System2
                      </Button>
                    </div>
                    <div className="edit">
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              <Pagination/>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default AllPurchaseOrders;
