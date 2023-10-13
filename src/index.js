import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import * as serviceWorker from './registerServiceWorker';

// core components
import Admin from "./layouts/Admin.js";
import Manage from "./layouts/Manage.js"
// import RTL from "layouts/RTL.js";

import "./assets/css/material-dashboard-react.css?v=1.10.0";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  return library;
};

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <BrowserRouter>
      <Switch>
        <Route path="/client" component={Admin} />
        <Route path="/manage" component={Manage} />
        {/* <Route path="/rtl" component={RTL} /> */}
        <Redirect from="/" to="/client/TokenLock" />
      </Switch>
    </BrowserRouter>
  </Web3ReactProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();