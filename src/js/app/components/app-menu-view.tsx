import * as React from "react";
import { observer } from "mobx-react";
import { drawtoolHelper } from "../drawtool-helper";
import { dataStore } from "../data-store";
import { ButtonView } from "./button-view";
import { SharingRelay } from "cc-sharing";
import { shareClient } from "../sharing-support";

import "../../../css/app-menu.styl"

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
    // const publish = () => shareClient.handlePublishMessage();
    return(
        <div className="menu-bar" onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation() }>
          <span>Collaboration Space</span>
          {
            (dataStore.windowManager.selectedWindow != null)
            ? <ButtonView action={drawtoolHelper.openPrivateCopy.bind(drawtoolHelper)} text="Make private copy"/>
            : <ButtonView action={() => {} } disabled={true} text="Make private copy"/>
          }
          {/* <ButtonView action={publish} text="share"/> */}
          <ButtonView action={drawtoolHelper.openNewPrivateDrawtool} text="New private drawing"/>
          <ButtonView action={drawtoolHelper.openNewSharedDrawtool} text="New shared drawing"/>
        </div>
    );
  }
}