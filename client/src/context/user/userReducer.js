import {
  USER_LIST,
  USER_ERROR,
  USER_PERPAGE,
  USER_FETCHPAGE,
  USER_SEARCHTERM,
  USER_SORTORDER
} from '../Types';

export default (state, action) => {
  switch(action.type) {
    case USER_LIST:
      return {
        ...state,
        users: action.payload.data.users,
        total_page: action.payload.data.total_pages
      };
    case USER_PERPAGE:
      return {
        ...state,
        per_page: action.payload
      };
    case USER_FETCHPAGE:
      return {
        ...state,
        fetch_page: action.payload
      };
    case USER_SEARCHTERM:
      return {
        ...state,
        search_term: action.payload
      };
    case USER_SORTORDER:
      return {
        ...state,
        sort_order: action.payload.sortOrder,
        sort_by: action.payload.sortBy
      };
  }
};