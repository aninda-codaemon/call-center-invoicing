import React, {useEffect, useContext, useState} from "react";
import { CSVLink } from "react-csv";
import moment from 'moment';
import { Row, Col, Button, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';

import "./all-purchase-orders.scss";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import Pagination from "./invoice-pagination";
import SortingIcon from "../../components/sortingicon/sortingicon";

import AuthContext from '../../context/auth/authContext'; 
import InvoiceContext from '../../context/invoice/invoiceContext';

function AllPurchaseOrders(props) {
  const authContext = useContext(AuthContext);
  const{ user } = authContext;
  const invoiceContext = useContext(InvoiceContext);
  const { invoices, fetch_page, per_page, sort_by, sort_order, search_term, total_page } = invoiceContext;

  const showInvoicesList = () => {
    return invoices.map( (invoice, index) => {
      const time_full = `${moment(invoice.date_opened_timestamp).format('ddd MMM D YYYY kk:mm:ss')} GMT ${moment(invoice.date_opened_timestamp).format('Z')}`;
      return (
        <React.Fragment key={invoice.id}>
          <div className="table-body">
            <div className="check-box-area">
              <label className="custom-checkbox">
                <input id={`invoice_${index}`} type="checkbox" />
                <span className="checkmark" />
              </label>
            </div>
            <div className="invoice">{ invoice.invoice_id }</div>
            <div className="fname">{ invoice.first_name }</div>
            <div className="lname">{ invoice.last_name }</div>
            <div className="phone">{ invoice.phone_number }</div>
            <div className="service-type">{ invoice.service_type }</div>
            {/* <div className="status paid dispatched yet-to-pay visited ">{} { invoice.status }</div> */}
            <div className="status paid">{} { invoice.status }</div>
            <div className="amount">{ invoice.amount }</div>
            <div className="data-opened">
              { time_full }
            </div>
            <div className="dispatching-system">
              <Button variant={ invoice.msa_system === 'SYSTEM 1' ? 'danger' : 'primary' } size="sm">
              { invoice.msa_system }
              </Button>
            </div>
            <div className="edit">
              <Link to="/invoice-overview"><i className="fa fa-pencil" aria-hidden="true" /></Link>
            </div>
          </div>
        </React.Fragment>
      );
    });
  }

  const [searchTerms, setSearchTerms] = useState(search_term);

  const handleSearchTermsChange = (e) => {
    console.log('Search terms');
    console.log(e.target.value);
    setSearchTerms(e.target.value);
  }

  const handleSearchTermsSubmit = (e) => {
    e.preventDefault();
    const page_no = 1;
    invoiceContext.update_search_terms(searchTerms);
    invoiceContext.update_fetch_page(page_no);
    invoiceContext.get_invoices(page_no, per_page, sort_by, sort_order, searchTerms);
  };

  const [mainCheckbox, setMainCheckbox] = useState(false);

  const handleMainCheckboxChange = (e) => {
    setMainCheckbox(!mainCheckbox);
    // Make the checkboxes checked or unchecked    
    const total_checkbox = invoices.length;
    for (let i = 0; i < total_checkbox; i++) {
      document.getElementById(`invoice_${i}`).checked = !mainCheckbox;
    }
  }

  const handleSortOrder = (sortBy, sortOrder) => {
    console.log('Sort order');
    console.log({sortBy, sortOrder});
    invoiceContext.update_sort_order({sortBy, sortOrder});
    invoiceContext.get_invoices(fetch_page, per_page, sortBy, sortOrder, search_term);
  }

  const handlePagination = () => {
    if (total_page > 0) {
      return <Pagination />;
    } else {
      return null;
    }
  }

  useEffect(() => {
    // Call the invoices list from context
    console.log('User');
    console.log(user);
    if (user !== null) {
      invoiceContext.get_invoices(fetch_page, per_page, sort_by, sort_order, search_term);
    }

  }, [user]);

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
                  <Col className="text-right export">
                    {/* Export <i className="fa fa-share" aria-hidden="true" /> */}
                    <CSVLink
                      data={[]}
                      filename={"my-file.csv"}
                      className=""
                      style={{
                        color: '#dd2d3e'
                      }}
                      target="_blank"
                    >
                      Export <i className="fa fa-share" aria-hidden="true" />                      
                    </CSVLink>
                  </Col>
                </Row>
              </header>
              <div className="hr-scroll">
                <div className="table-content">
                  <header>
                    <div className="check-box-area">
                      <label className="custom-checkbox">
                        <input type="checkbox" onChange={handleMainCheckboxChange} />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="invoice">Invoice 
                      <SortingIcon 
                        workAction={(sort_by == 'invoice_id') ? true : false} 
                        sortBy={'invoice_id'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                      </div>
                    <div className="fname">First Name 
                      <SortingIcon 
                        workAction={(sort_by == 'first_name') ? true : false} 
                        sortBy={'first_name'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="lname">Last Name 
                      <SortingIcon 
                        workAction={(sort_by == 'last_name') ? true : false} 
                        sortBy={'last_name'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="phone">Phone Number
                      <SortingIcon 
                        workAction={(sort_by == 'phone_number') ? true : false} 
                        sortBy={'phone_number'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="service-type">Service Type                      
                      <SortingIcon 
                        workAction={(sort_by == 'service_type') ? true : false} 
                        sortBy={'service_type'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="status">Status
                      <SortingIcon 
                        workAction={(sort_by == 'status') ? true : false} 
                        sortBy={'status'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="amount">Amount 
                      <SortingIcon 
                        workAction={(sort_by == 'amount') ? true : false} 
                        sortBy={'amount'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="data-opened">Data Opened (Local Time)
                      <SortingIcon 
                        workAction={(sort_by == 'date_opened_full') ? true : false} 
                        sortBy={'date_opened_full'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="dispatching-system">Dispatching System
                      <SortingIcon 
                        workAction={(sort_by == 'msa_system') ? true : false} 
                        sortBy={'msa_system'} 
                        handleSortOrderClick={handleSortOrder} 
                        sortOrder={sort_order} 
                        />
                    </div>
                    <div className="edit">&nbsp;</div>
                  </header>
                  { invoices.length > 0 ? showInvoicesList() : (<div style={{ color: '#000' }}>No records found!</div>) }
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

export default AllPurchaseOrders;
