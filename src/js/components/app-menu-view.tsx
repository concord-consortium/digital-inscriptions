import * as React from "react";
import { observer } from 'mobx-react';

export interface AppMenuViewProps {
  height?:number
}

export interface AppMenuViewState {}

@observer
export class AppMenuView extends React.Component<AppMenuViewProps, AppMenuViewState> {
  public state:AppMenuViewState

  constructor(props:AppMenuViewProps){
    super(props);
    this.state = {
      session: "default"
    };
  }

  render() {
    return(
        <div className="menu-bar">
          <span> Digital Inscriptions Collaboration Space </span>
        </div>
    );
  }
}