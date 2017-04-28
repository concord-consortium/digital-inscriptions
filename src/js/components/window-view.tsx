import * as React from "react";
import { observer } from "mobx-react";
import { DragType, WindowProps, WindowManager } from "../window-manager";
import { dataStore } from "../data-store";
import "../../css/window.styl";

export interface WindowViewProps {
  window: WindowProps
  title: string
}

export interface WindowViewState {}

@observer
export class WindowView extends React.Component<WindowViewProps, WindowViewState> {
  public state:WindowViewState

  constructor(props:WindowViewProps){
    super(props);
  }

  mouseDownWindow(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.Position);
  };

  growRightDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowRight);
  };

  growBottomDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowDown);
  };

  growBothDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowBoth);
  };

  mouseUp(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(null, 0, 0, DragType.None);
  };


  render() {
    const w = this.props.window;

    const style:React.CSSProperties = {
      position: "absolute",
      top: `${w.top}px`,
      left: `${w.left}px`,
      width: `${w.width}px`,
      height: `${w.height}px`,
    }
    const iframeProps = {
      width: w.width - 10,
      height: w.height - 25,
      pointerEvents: "all",
      url: w.url || undefined
    };
    const selected = (dataStore.windowManager.selectedWindow == this.props.window)
    const someWindowSelected = (dataStore.windowManager.selectedWindow  != null)
    const classNames = selected ? "window selected" : "window"
    if(selected) {
      iframeProps.pointerEvents="none";
    }
    return(
        <div className={classNames}
            style={style}>
          <div
            className="titlebar"
            onMouseDown={this.mouseDownWindow.bind(this)}
            onMouseUp={this.mouseUp.bind(this)} >
              <span>{this.props.title}</span>
              {
                selected ?
                  <span
                    onClick={ () => dataStore.windowManager.removeWindow(this.props.window) }
                    className="closer">✖</span>
                :
                  ""
              }
          </div>
          <iframe width={iframeProps.width} height={iframeProps.height} src={iframeProps.url}></iframe>
          {someWindowSelected ? <div className="iFrameHider"/> : "" }
          <div
            className="rightGrow"
            onMouseDown={this.growRightDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)}
          />

          <div
            className="bottomGrow"
            onMouseDown={this.growBottomDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)}
          />

          <div
            className="bottomRightGrow"
            onMouseDown={this.growBothDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)}
          />
        </div>
    );
  }
}