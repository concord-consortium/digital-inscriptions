import * as React from "react";
import {observer} from 'mobx-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DevTools from "mobx-react-devtools";

export interface AppViewProps {}
export interface AppViewState {
  session: string
}

@observer
export class AppView extends React.Component<AppViewProps, AppViewState> {
  public state:AppViewState

  constructor(props:AppViewProps){
    super(props);
    this.state = {
      session: "default"
    };
  }

  render() {
    return(
      <MuiThemeProvider>
        <div>
          Hello from React.
        </div>
      </MuiThemeProvider>
    );
  }
}