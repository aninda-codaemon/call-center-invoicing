import React, { useState, useContext, useEffect } from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import Pagination from "./user-pagination";
import SortingIcon from "../../components/sortingicon/sortingicon";
import { Row, Col, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import UserContext from '../../context/user/userContext';

function Users() {
  const userContext = useContext(UserContext);
  const { users, fetch_page, per_page, sort_by, sort_order, search_term, total_page } = userContext;

  const list_users = () => {    
    return users.map( (user, index) => (
      <React.Fragment key={user.id}>
        <div className="table-body">
          <div className="check-box-area">
            <label className="custom-checkbox">
              <input 
                type="checkbox"
                id={`user_${index}`}
              />
              <span className="checkmark" />
            </label>
          </div>
          <div className="fname">{user.first_name}</div>
          <div className="lname">{user.last_name}</div>
          <div className="email">{user.email_id}</div>
          <div className="phone">{user.contact_no}</div>
          <div className="dispatching-system">
            <Button variant="danger" size="sm" key={user.id}>
              Block {user.status}
            </Button>
          </div>
          <div className="edit">
            <Link to="/edit-user"><i className="fa fa-pencil" aria-hidden="true" /></Link>
          </div>
        </div>
      </React.Fragment>
    ));    
  }

  const [searchTerms, setSearchTerms] = useState(search_term);

  const handleSearchTermsChange = (e) => {
    setSearchTerms(e.target.value);
  }

  const handleSearchTermsSubmit = (e) => {
    e.preventDefault();
    const page_no = 1;
    userContext.update_search_terms(searchTerms);
    userContext.update_fetch_page(page_no);
    userContext.get_users(page_no, per_page, sort_by, sort_order, searchTerms);    
  };

  const [mainCheckbox, setMainCheckbox] = useState(false);

  const handleMainCheckboxChange = (e) => {
    setMainCheckbox(!mainCheckbox);
    // Make the checkboxes checked or unchecked    
    const total_checkbox = users.length;
    for (let i = 0; i < total_checkbox; i++) {
      document.getElementById(`user_${i}`).checked = !mainCheckbox;
    }
    
  }

  const handlePagination = () => {
    if (total_page > 0) {
      return <Pagination />;
    } else {
      return null;
    }
  }

  const handleSortOrder = (sortBy, sortOrder) => {
    console.log('Sort order');
    console.log({sortBy, sortOrder});
    userContext.update_sort_order({sortBy, sortOrder});
    userContext.get_users(fetch_page, per_page, sortBy, sortOrder, search_term);
  }

  useEffect(() => {
    userContext.get_users(fetch_page, per_page, sort_by, sort_order, search_term);
    //eslint-disable-next-line
  }, []);

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
                    <form className="search-area" onSubmit={handleSearchTermsSubmit}>
                      <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        name={searchTerms}
                        onChange={handleSearchTermsChange}
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
                        <input 
                          type="checkbox"                          
                          onChange={handleMainCheckboxChange}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="fname">
                      First Name <SortingIcon workAction={(sort_by == 'first_name') ? true : false} sortBy={'first_name'} handleSortOrderClick={handleSortOrder} sortOrder={sort_order} />
                    </div>
                    <div className="lname">
                      Last Name <SortingIcon workAction={(sort_by == 'last_name') ? true : false} sortBy={'last_name'} handleSortOrderClick={handleSortOrder} sortOrder={sort_order} />
                    </div>
                    <div className="email">Email</div>
                    <div className="phone">Phone Number</div>
                    <div className="dispatching-system">&nbsp;</div>
                    <div className="edit">&nbsp;</div>
                  </header>
                  { 
                    users.length > 0 ? list_users() : (<div style={{ color: '#000' }}>No records found!</div>)
                  }
                </div>
              </div>
              { handlePagination() }
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default Users;
