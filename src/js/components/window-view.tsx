import * as React from "react";
import { observer } from "mobx-react";
import { DragType, WindowProps, WindowManager } from "../window-manager";
import { drawtoolHelper } from "../drawtool-helper";
import { dataStore } from "../data-store";
import "../../css/window.styl";
import { shareClient } from "../sharing-support";
export interface WindowViewProps {
  window: WindowProps
}

export interface WindowViewState {
  isEditing: boolean
  editText: string
}

@observer
export class WindowView extends React.Component<WindowViewProps, WindowViewState> {
  public state:WindowViewState
  input: HTMLInputElement;
  constructor(props:WindowViewProps){
    super(props);
    this.state = {
      isEditing: false,
      editText: this.props.window.title
    }
  }

  componentDidMount() {
    // Connect the sharing service so that sharinator can work.
    shareClient.connectChild(this.refs['iframe'] as HTMLIFrameElement, this.props.window.id);
  }

  doubleClickTitle() {
    this.setState({isEditing: true, editText: this.props.window.title});
    this.input.focus();
  }

  keyUp(e:React.KeyboardEvent<HTMLInputElement>) {
    if(e.keyCode ==9 || e.keyCode == 13) {
      this.setState({isEditing: false})
    }
  }

  changeTitle() {
    this.props.window.title = this.input.value;
  }

  doneEditing() {
    this.setState({isEditing:false});
  }

  mouseDownWindow(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.Position);
    e.stopPropagation();
  };

  growRightDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowRight);
    e.stopPropagation();
  };

  growBottomDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowDown);
    e.stopPropagation();
  };

  growBothDown(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.windowSelected(this.props.window, e.clientX, e.clientY, DragType.GrowBoth);
    e.stopPropagation();
  };

  mouseUp(e: React.MouseEvent<HTMLDivElement>) {
    dataStore.windowManager.mouseUp();
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
    const dragging = (dataStore.windowManager.draggingWindow == this.props.window)
    const someWindowSelected = (dataStore.windowManager.selectedWindow  != null)
    const title = (this.props.window.title.length > 0) ? this.props.window.title : "untitled"
    const classNames = selected ? "window selected" : "window"
    const editing = this.state.isEditing;
    if(dragging) {
      iframeProps.pointerEvents="none";
    }
    return(
        <div className={classNames}
            style={style}>
          <div
            className="titlebar"
            onMouseDown={this.mouseDownWindow.bind(this)}
            onMouseUp={this.mouseUp.bind(this)} >
            {
              editing
              ?
                <input
                  type='text'
                  value={ this.props.window.title }
                  ref={ (input) =>  this.input = input }
                  onChange={ this.changeTitle.bind(this) }
                  onBlur={ this.doneEditing.bind(this) }
                  onKeyUp={ this.keyUp.bind(this) }
                  onMouseDown={ (e:React.MouseEvent<HTMLInputElement>)=> e.stopPropagation() }
                  />
              :
                 <span onDoubleClick={this.doubleClickTitle.bind(this)} >{title}</span>
            }
              <span
                onClick={ () => dataStore.windowManager.removeWindow(this.props.window) }
                className="closer">✖</span>
          </div>
          <iframe ref={'iframe'} width={iframeProps.width} height={iframeProps.height} src={iframeProps.url}></iframe>
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