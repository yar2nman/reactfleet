import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';
import "./styles.css";
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

var mountNode = document.getElementById("app");
ReactDOM.render(<App  />, mountNode);
