import {
  USER_LIST,
  USER_ERROR,
  USER_PERPAGE,
  USER_FETCHPAGE,
  USER_SEARCHTERM,
  USER_SORTORDER,
  USER_SAVE,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
  USER_INFO,
  USER_UPDATE,
  USER_PASSWORD
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
    case USER_SAVE:
      return {
        ...state,
        success: [{ msg: action.payload.data.msg }],
        error: null
      };
    case USER_ERROR:
      return {
        ...state,
        success: null,
        error: action.payload
      };
    case CLEAR_SUCCESS:
      return {
        ...state,
        success: null
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case USER_INFO:
      return {
        ...state,
        user: action.payload.data.user
      };
    case USER_UPDATE:
        return {
          ...state,
          success: [{ msg: action.payload.data.msg }],
          error: null
        };
    case USER_PASSWORD:
      return {
        ...state,
        success: [{ msg: action.payload.data.msg }],
        error: null
      };
  }
};