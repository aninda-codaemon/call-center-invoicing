import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Login from './pages/Login';
import Dasboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InvoiceOverview from './pages/InvoiceOverview';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login}/>
        <Route path="/dashboard" component={Dasboard}/>
        <Route path="/admin-dashboard" component={AdminDashboard}/>
        <Route path="/invoice-overview" component={InvoiceOverview}/>
      </Switch>
    </Router>
      
  
  );
}

export default App;
