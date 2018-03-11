
import React from 'react';
import ReactDOM from 'react-dom';
import {MainPage} from "./pages/main/mainPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {StatusServiceHttp} from "./pages/status/statusServiceHttp";
import {TenantsPage} from "./pages/tenants/tenantsPage";
import {ServicePage} from "./pages/service/servicePage";
import {HorsesPage} from "./pages/horses/horsesPage";
import './custom.scss';


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactDOM.render(
  <div className="container">
    <div className="row">
      <div className="col-sm">
        <Router>
          <Switch>
            <Route exact path="/ui/" component={MainPage} />
            <Route exact path="/ui/admin/status" component={StatusServiceHttp} />
            <Route exact path="/ui/admin/tenants" component={TenantsPage} />
            <Route exact path="/ui/admin/service" component={ServicePage} />
            <Route exact path="/ui/:tenant/horses" component={HorsesPage} />
            <Route component={MainPage} />
          </Switch>
        </Router>
      </div>
    </div>
  </div>,
  document.getElementById("app")
);
