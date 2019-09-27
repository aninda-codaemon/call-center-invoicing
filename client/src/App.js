import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AuthState from './context/auth/AuthState';
import UserState from './context/user/UserState';
import InvoiceState from './context/invoice/InvoiceState';

import Login from "./pages/login/login";
import AllPurchaseOrders from "./pages/all-purchase-orders/all-purchase-orders";
import NewPurchaseOrder from "./pages/new-purchase-order/new-purchase-order";
import PurchaseOrder from './pages/new-purchase-order/purchase-order';
import RefundRequest from "./pages/refund-request/refund-request";
import Users from "./pages/users/users";
import CreateNewUser from "./pages/create-new-user/create-new-user";
import InvoiceOverview from "./pages/invoice-overview/invoice-overview";
import ForgotPassword from "./pages/forgot-password/forgot-password";
import EditAccount from "./pages/edit-account/edit-account";
import EditUser from "./pages/edit-user/edit-user";
import Logout from './pages/login/logout';

import PrivateRoute from './routing/PrivateRoute';

import setAuthToken from './utils/setAuthToken';

if (localStorage.getItem('xtoken')) {
  setAuthToken(localStorage.getItem('xtoken'));
}

function App() {
  return (
    <AuthState>
      <UserState>
        <InvoiceState>
          <Router>
            <Switch>
              <Route path="/" exact component={Login} />          
              <Route path="/forgot-password" component={ForgotPassword} />
              <PrivateRoute path="/all-purchase-orders" component={AllPurchaseOrders} />
              <PrivateRoute path="/new-purchase-order" component={PurchaseOrder} />
              <PrivateRoute path="/refund-request" component={RefundRequest} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/edit-user/:id" component={EditUser} />
              <PrivateRoute path="/edit-account" component={EditAccount} />
              <PrivateRoute path="/create-new-user" component={CreateNewUser} />
              <PrivateRoute path="/invoice-overview/:invoice_id" component={InvoiceOverview} />
              <PrivateRoute path="/logout" component={Logout} />
            </Switch>
          </Router>
        </InvoiceState>
      </UserState>
    </AuthState>
  );
}

export default App;
