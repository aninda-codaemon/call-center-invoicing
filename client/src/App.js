import React from "react";
import "./App.scss";

import AuthState from './context/auth/AuthState';
import UserState from './context/user/UserState';
import InvoiceState from './context/invoice/InvoiceState';

import setAuthToken from './utils/setAuthToken';

import Main from './Main';

if (localStorage.getItem('xtoken')) {
  setAuthToken(localStorage.getItem('xtoken'));
}

function App() {  
  return (
    <AuthState>
      <UserState>
        <InvoiceState>          
          <Main />
        </InvoiceState>
      </UserState>
    </AuthState>
  );
}

export default App;
