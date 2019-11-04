import React, { useContext } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";

import AuthContext from './context/auth/authContext';

import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';

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


const Main = (props) => {
  const authContext = useContext(AuthContext);
  const { sidebarLeftCol, sidebarRightCol } = authContext;

  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Header />
      <Container fluid={true} className="content-area">
        <Row className="main-content">
          <Col md={sidebarLeftCol} className="align-self-stretch">
            <Sidebar />
          </Col>
          <Col md={sidebarRightCol} className="right-part">                
            <Switch>                        
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
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default Main;
