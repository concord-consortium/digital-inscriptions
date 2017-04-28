import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import "../css/app.styl";

const rollbar  = require("./rollbar");

injectTapEventPlugin();

ReactDOM.render(<AppView/>, document.getElementById("App"));
