import * as React from "react";
import {observer} from 'mobx-react';
//import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DevTools from "mobx-react-devtools";
import { AppMenuView } from "./app-menu-view";
import { WindowView  } from "./window-view";

import { WindowProps } from "../window-manager";
import { dataStore } from "../data-store";

const MuiThemeProvider = require("material-ui/styles/MuiThemeProvider").default;  // TODO: fix with proper import above when type defs work
const _ = require("lodash");

export interface AppViewProps {}
export interface AppViewState {
  session: string
}

@observer
export class AppView extends React.Component<AppViewProps, AppViewState> {
  constructor(props:AppViewProps){
    super(props);
    this.state = {
      session: "default"
    };
  }

  move(e: React.MouseEvent<HTMLDivElement>) {
    const x = e.clientX;
    const y = e.clientY;
    dataStore.windowManager.drag(x, y);
  };

  up(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.mouseUp();
  };

  down(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.mouseDown();
  };

  onDrop(e: any) {
    e.preventDefault();
    const lines = e.dataTransfer.getData("text/uri-list").split("\n");
    const url = lines[0];
    if(url) {
      dataStore.windowManager.addWindowFromDrag(url);
    }
  }

  render() {
    const windows = dataStore.windowManager.windows;
    return(
      <MuiThemeProvider>
        <div
          onMouseUp={this.up.bind(this)}
          onMouseDown={this.down.bind(this)}
          onMouseMove={this.move.bind(this)}
          onDrop={this.onDrop.bind(this)}
          onDragOver={(e:any) => e.preventDefault()}
          className="container">
          <AppMenuView/>
          { _.map(windows, (w:WindowProps, i:number) => <WindowView key={w.id}  window={w}/> ) }
        </div>
      </MuiThemeProvider>
    );
  }
}