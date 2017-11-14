import * as React from "react";
import {observer} from 'mobx-react';

export interface PromptsViewProps {}
export interface PromptsViewState {}

@observer
export class PromptsView extends React.Component<PromptsViewProps, PromptsViewState> {
  constructor(props:PromptsViewProps){
    super(props);
    this.state = {};
  }

  render() {
    return <div>Hello</div>
  }
}