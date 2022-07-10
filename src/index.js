import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import mixpanel from "mixpanel-browser";
import * as serviceWorker from "./serviceWorker";
import "./index.scss";
import App from "./App";

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: "https://15e1f7e22eb840c9873085d6c844b696@sentry.io/5182041",
  });

process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_TRACKING_ID &&
  mixpanel.init(process.env.REACT_APP_TRACKING_ID, {
    enable_collect_everything: true,
  });

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
process.env.NODE_ENV === "production" && serviceWorker.register();
