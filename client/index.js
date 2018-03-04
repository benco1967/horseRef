
import React from 'react';
import ReactDOM from 'react-dom';
import {MainPage} from "./pages/main/mainPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {StatusServiceHttp} from "./pages/status/statusServiceHttp";
import {TenantsPage} from "./pages/tenants/tenantsPage";
import {ServicePage} from "./pages/service/servicePage";


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/ui/" component={MainPage} />
      <Route exact path="/ui/admin/status" component={StatusServiceHttp} />
      <Route exact path="/ui/admin/tenants" component={TenantsPage} />
      <Route exact path="/ui/admin/service" component={ServicePage} />
    </div>
  </Router>,
  document.getElementById("app")
);
