import * as React from "react";
import { observer } from "mobx-react";
import { drawtoolHelper } from "../drawtool-helper";
export interface DrawtoolButtonViewProps {}
export interface DrawtoolButtonViewState {}

@observer
export class DrawtoolButtonView extends React.Component<DrawtoolButtonViewProps, DrawtoolButtonViewState> {
  constructor(props:DrawtoolButtonViewProps){
    super(props);
  }

  render() {
    return(
        <div className="button">
          <a href="" target="_blank" onClick={drawtoolHelper.handleClick}>new drawing</a>
        </div>
    );
  }
}