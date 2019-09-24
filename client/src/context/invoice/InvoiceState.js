import React, { useReducer, useContext } from 'react';
import axios from 'axios';

import {
  INVOICE_LIST,
  INVOICE_ERROR,
  SERVER_URL,
  INVOICE_PERPAGE,
  INVOICE_FETCHPAGE,
  INVOICE_SEARCHTERM,
  INVOICE_SORTORDER,
  USER_SAVE,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
  USER_INFO,
  USER_UPDATE,
  USER_PASSWORD
} from '../Types';
import InvoiceContext from './invoiceContext';
import InvoiceReducer from './invoiceReducer';

const InvoiceState = (props) => {
  const initialState = {
    invoices: [],
    sort_by: 'invoice_id',
    sort_order: 'ASC',
    search_term: '',
    fetch_page: 1,
    per_page: 10,
    total_page: 0,
    error: null,
    success: null
  };

  const [state, dispatch] = useReducer(InvoiceReducer, initialState);

  const get_invoices = async (fetch_page, per_page, sort_by, sort_order, search_term) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const formData = {
      sort_by,
      sort_order,
      search_term,
      fetch_page,
      per_page
    };
    console.log('Form data');
    console.log(formData);

    try {
      const response = await axios.post(`${SERVER_URL}/api/order`, formData, config);
      console.log('Invoice list response');
      console.log(response);
      dispatch({
        type: INVOICE_LIST,
        payload: response.data
      });
    } catch (error) {
      console.log('Invoice list error');
      console.log(error);
      dispatch({
        type: INVOICE_ERROR,
        payload: error.response.data.errors
      });
    }
  }

  const update_search_terms = async (value) => {
    console.log('Search terms');
    dispatch({
      type: INVOICE_SEARCHTERM,
      payload: value
    });
  }

  const update_fetch_page = async (value) => {
    dispatch({
      type: INVOICE_FETCHPAGE,
      payload: value
    });
  }

  const update_per_page = (value) => {
    dispatch({
      type: INVOICE_PERPAGE,
      payload: value
    });
  }

  const update_sort_order = (value) => {
    dispatch({
      type: INVOICE_SORTORDER,
      payload: value
    });
  }

  return <InvoiceContext.Provider
    value={{
      invoices: state.invoices,
      sort_by: state.sort_by,
      sort_by: state.sort_by,
      sort_order: state.sort_order,
      search_term: state.search_term,
      fetch_page: state.fetch_page,
      per_page: state.per_page,
      total_page: state.total_page,
      error: state.error,
      success: state.success,
      get_invoices,
      update_search_terms,
      update_fetch_page,
      update_per_page,
      update_sort_order
    }}
  >
    { props.children }
  </InvoiceContext.Provider>
}

export default InvoiceState;