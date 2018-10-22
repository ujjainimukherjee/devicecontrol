import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import 'font-awesome/css/font-awesome.css';
import LocalServiceWorkerRegister from './sw-register';


ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
LocalServiceWorkerRegister();