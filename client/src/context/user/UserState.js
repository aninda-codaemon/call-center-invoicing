import React, { useReducer, useContext } from 'react';
import axios from 'axios';

import {
  USER_LIST,
  USER_ERROR,
  SERVER_URL,
  USER_PERPAGE,
  USER_FETCHPAGE,
  USER_SEARCHTERM,
  USER_SORTORDER
} from '../Types';
import UserContext from './userContext';
import UserReducer from './userReducer';

const UserState = (props) => {
  const initialState = {
    users: [],
    sort_by: 'first_name',
    sort_order: 'ASC',
    search_term: '',
    fetch_page: 1,
    per_page: 2,
    total_page: 0,
    error: null
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  const get_users = async (fetch_page, per_page, sort_by, sort_order, search_term) => {
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
    console.log('Form Data');
    console.log(formData);

    try {
      const response = await axios.post(`${SERVER_URL}/api/users`, formData, config);
      console.log('User list response');
      console.log(response);
      dispatch({
        type: USER_LIST,
        payload: response.data
      });
    } catch (error) {
      console.log('User list error');
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errors
      });
    }
  }

  const update_per_page = (value) => {
    dispatch({
      type: USER_PERPAGE,
      payload: value
    });
  }

  const update_fetch_page = (value) => {
    dispatch({
      type: USER_FETCHPAGE,
      payload: value
    });
  }

  const update_search_terms = (value) => {
    dispatch({
      type: USER_SEARCHTERM,
      payload: value
    });
  }

  const update_sort_order = (value) => {
    dispatch({
      type: USER_SORTORDER,
      payload: value
    });
  }

  return <UserContext.Provider
    value={{
      users: state.users,
      sort_by: state.sort_by,
      sort_order: state.sort_order,
      search_term: state.search_term,
      fetch_page: state.fetch_page,
      per_page: state.per_page,
      total_page: state.total_page,
      get_users,
      update_per_page,
      update_fetch_page,
      update_search_terms,
      update_sort_order
    }}
  >
    { props.children }
  </UserContext.Provider>
};

export default UserState;