import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { initFirebase } from "./utils/firebaseHandler";
import Modal from "react-modal";

initFirebase();
Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
