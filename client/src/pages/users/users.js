import React from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import Pagination from "../../components/pagination/pagination";
import SortingIcon from "../../components/sortingicon/sortingicon";
import { Row, Col, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Users() {
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
                  <Col className="text-right">
                    <Link to="/create-new-user">
                      <Button variant="primary" className="create-new-user">
                        Create New User
                      </Button>
                    </Link>
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
                    <div className="fname">
                      First Name <SortingIcon />
                    </div>
                    <div className="lname">Last Name</div>
                    <div className="email">Email</div>
                    <div className="phone">Phone Number</div>
                    <div className="dispatching-system">&nbsp;</div>
                    <div className="edit">&nbsp;</div>
                  </header>
                  <div className="table-body">
                    <div className="check-box-area">
                      <label className="custom-checkbox">
                        <input type="checkbox" />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="fname">Andrew</div>
                    <div className="lname">Johnson</div>
                    <div className="email">andrewjohnson@yahoo.com</div>
                    <div className="phone">7363524284</div>
                    <div className="dispatching-system">
                      <Button variant="danger" size="sm">
                        Block
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
                    <div className="fname">Andrew</div>
                    <div className="lname">Johnson</div>
                    <div className="email">andrewjohnson@yahoo.com</div>
                    <div className="phone">7363524284</div>
                    <div className="dispatching-system">
                      <Button variant="danger" size="sm">
                        Block
                      </Button>
                    </div>
                    <div className="edit">
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              <Pagination />
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default Users;
