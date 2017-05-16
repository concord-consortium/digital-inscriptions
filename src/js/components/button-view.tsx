import * as React from "react";
import { observer } from "mobx-react";

export interface ButtonViewProps {
  text: string
  action: () => void|any
  disabled?: boolean
}
export interface ButtonViewState {}
import "../../css/button.styl"

@observer
export class ButtonView extends React.Component<ButtonViewProps, ButtonViewState> {
  constructor(props:ButtonViewProps){
    super(props);
  }
  doAction(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    if(this.props.disabled) { return };
    this.props.action();
  }

  render() {
    const className = this.props.disabled ? "button disabled" : "button"
    return(
        <div className={className} onClick={this.doAction.bind(this)}>
          <span>{this.props.text}</span>
        </div>
    );
  }
}