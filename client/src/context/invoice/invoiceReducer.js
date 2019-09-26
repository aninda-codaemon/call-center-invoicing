import {
  INVOICE_LIST,
  INVOICES_CLEAR,
  INVOICE_ERROR,
  INVOICE_PERPAGE,
  INVOICE_FETCHPAGE,
  INVOICE_SEARCHTERM,
  INVOICE_SORTORDER,
  USER_SAVE,
  CLEAR_SUCCESS,
  CLEAR_ERROR,
  INVOICE_INFO,
  INVOICE_CLEAR,
  INVOICE_UPDATE,
  INVOICE_LOADING,
  INVOICE_SENDLINK,
  INVOICE_LINKLOADING
} from '../Types';

export default (state, action) => {
  switch(action.type) {
    case INVOICE_LIST:
      return {
        ...state,        
        invoices: action.payload.data.invoices,
        csv_data: action.payload.data.csv,
        total_page: action.payload.data.total_pages,
        loading: false
      };
    case INVOICES_CLEAR:
      return {
        ...state,        
        invoices: [],
        csv_data: null,
        sort_by: 'invoice_id',
        sort_order: 'ASC',
        search_term: '',
        fetch_page: 1,
        total_page: 0,
        loading: false,
        error: null,
        success: null
      };
    case INVOICE_PERPAGE:
      return {
        ...state,
        per_page: action.payload
      };
    case INVOICE_FETCHPAGE:
      return {
        ...state,
        fetch_page: action.payload
      };
    case INVOICE_SEARCHTERM:
      return {
        ...state,
        search_term: action.payload
      };
    case INVOICE_SORTORDER:
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
    case INVOICE_ERROR:
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
    case INVOICE_INFO:
      return {
        ...state,
        invoice: action.payload.data.invoice
      };
    case INVOICE_CLEAR:
      return {
        ...state,
        invoice: null
      };
    case INVOICE_UPDATE:
        return {
          ...state,
          invoice: action.payload.data.invoice,
          loading: false,
          success: [{ msg: action.payload.data.msg }],
          error: null
        };
    case INVOICE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case INVOICE_LINKLOADING:
      return {
        ...state,
        linkloading: action.payload
      };
    case INVOICE_SENDLINK:
      return {
        ...state,
        linkloading: false,
        invoice: action.payload.data.invoice,
        success: [{ msg: action.payload.data.msg }],
        error: null
      };
  }
};