import React, {useContext, useEffect} from 'react';
import {Route, Redirect} from 'react-router-dom';

import AuthContext from '../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const {isAuthenticated, loading, loadUser} = authContext;
  const token = localStorage.getItem('xtoken');

  useEffect(() => {
    loadUser();
  }, []);
  
  return (
    <Route 
      { ...rest } 
      render={props => !isAuthenticated || (token === undefined || token === null) ? (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
      ) : (
        <Component {...props} />
      )} 
    />
  );
};

export default PrivateRoute;