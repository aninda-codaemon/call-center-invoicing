import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/login/login";
import AllPurchaseOrders from "./pages/all-purchase-orders/all-purchase-orders";
import NewPurchaseOrder from "./pages/new-purchase-order/new-purchase-order";
import RefundRequest from "./pages/refund-request/refund-request";
import Users from "./pages/users/users";
import CreateNewUser from "./pages/create-new-user/create-new-user";
import InvoiceOverview from "./pages/invoice-overview/invoice-overview";
import ForgotPassword from "./pages/forgot-password/forgot-password";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/all-purchase-orders" component={AllPurchaseOrders} />
      <Route path="/new-purchase-order" component={NewPurchaseOrder} />
      <Route path="/refund-request" component={RefundRequest} />
      <Route path="/users" component={Users} />
      <Route path="/create-new-user" component={CreateNewUser} />
      <Route path="/invoice-overview" component={InvoiceOverview} />
    </Router>
  );
}

export default App;
