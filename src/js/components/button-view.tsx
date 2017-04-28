import * as React from "react";
import { observer } from "mobx-react";

export interface ButtonViewProps {
  text: string
  action: (optional:any) => void|any
}
export interface ButtonViewState {}
import "../../css/button.styl"

@observer
export class ButtonView extends React.Component<ButtonViewProps, ButtonViewState> {
  constructor(props:ButtonViewProps){
    super(props);
  }

  render() {
    return(
        <div className="button" onClick={this.props.action}>
          <span>{this.props.text}</span>
        </div>
    );
  }
}