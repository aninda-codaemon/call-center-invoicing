import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/login/login";
import AllPurchaseOrders from "./pages/all-purchase-orders/all-purchase-orders";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Route path="/all-purchase-orders" component={AllPurchaseOrders} />
    </Router>
  );
}

export default App;
