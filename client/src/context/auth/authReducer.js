import {
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  USER_LOADED
} from '../Types';

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: true,
        user: action.payload.data.user
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('xtoken', action.payload.data.user.token);
      return {
        ...state,
        token: action.payload.data.user.token,
        isAuthenticated: true,
        error: null
      };
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem('xtoken');
      return {
        ...state,
        token: undefined,
        isAuthenticated: false,
        loading: true,
        user: null,
        error: action.payload
      };
    case AUTH_ERROR:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: true,
        user: null,
        error: action.payload
      };
  }
}