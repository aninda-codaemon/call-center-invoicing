import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/login/login";
import AllPurchaseOrders from "./pages/all-purchase-orders/all-purchase-orders";
import NewPurchaseOrder from "./pages/new-purchase-order/new-purchase-order";
import RefundRequest from "./pages/refund-request/refund-request";
import CallAgents from "./pages/call-agents/call-agents";
import CreateNewAgent from "./pages/create-new-agent/create-new-agent";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Route path="/all-purchase-orders" component={AllPurchaseOrders} />
      <Route path="/new-purchase-order" component={NewPurchaseOrder} />
      <Route path="/refund-request" component={RefundRequest} />
      <Route path="/call-agents" component={CallAgents} />
      <Route path="/create-new-agent" component={CreateNewAgent} />
    </Router>
  );
}

export default App;
