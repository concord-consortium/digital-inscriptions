import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import * as injectTapEventPlugin from "react-tap-event-plugin";


injectTapEventPlugin();

ReactDOM.render(<AppView/>, document.getElementById("App"));
