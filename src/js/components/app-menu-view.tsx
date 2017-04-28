import * as React from "react";
import { observer } from "mobx-react";
import { drawtoolHelper } from "../drawtool-helper";
import { DrawtoolButtonView } from "./drawtool-button-view";
import "../../css/app-menu.styl"

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
          <DrawtoolButtonView />
        </div>
    );
  }
}