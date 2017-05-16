import { v1 as uuid } from "uuid";
import { observable, computed, action, ObservableMap} from "mobx";
import { drawtoolHelper } from "./drawtool-helper";

const _ = require("lodash");

export enum DragType { GrowRight, GrowDown, GrowBoth, Position, None }


export interface WindowProps {
  id: string
  index: number
  top: number
  left: number
  width: number
  height: number
  url: string
  title: string
}

export interface WindowMap {
  [key:string]: WindowProps
}

export class WindowManager {
  @observable windowMap: ObservableMap<WindowProps>
  @observable selectedWindow: WindowProps | null
  @observable dragType: DragType
  @observable dirty: boolean
  moveOffsetX: number
  moveOffsetY: number


  constructor() {
    this.windowMap = new ObservableMap<WindowProps>({});
    this.selectedWindow = null;
    this.dirty = true;
  }

  setMoveOffset(x:number, y:number, dragType:DragType) {
    this.moveOffsetX = x - (this.selectedWindow ? this.selectedWindow.left : 0);
    this.moveOffsetY = y - (this.selectedWindow ? this.selectedWindow.top : 0);
    this.dragType = dragType;
  }

  setState(windowMap:any) {
    this.windowMap.replace(windowMap);
    if(this.selectedWindow) {
      this.selectedWindow = this.windowMap.get(this.selectedWindow.id) || null;
    }
  }

  @action mouseUp() {
    this.dragType = DragType.None;
  }

  @action mouseDown() {
    this.selectedWindow = null;
    this.dragType = DragType.None;
  }

  @action moveRelative(x:number, y:number) {
    if(this.selectedWindow) {
      const dx = x - this.moveOffsetX;
      const dy = y - this.moveOffsetY;
      this.dirty = true;
      switch(this.dragType) {
        case DragType.Position:
          this.selectedWindow.top = dy;
          this.selectedWindow.left = dx;
          break;
        case DragType.GrowRight:
          this.selectedWindow.width = x -  (this.selectedWindow.left || 50);
          break;
        case DragType.GrowDown:
          this.selectedWindow.height = y - (this.selectedWindow.top || 50);
          break;
        case DragType.GrowBoth:
          this.selectedWindow.width = x -  (this.selectedWindow.left || 200);
          this.selectedWindow.height = y - (this.selectedWindow.top || 200);
          break;
      }
    }
  }


  windowSelected(window:WindowProps|null, x:number=0, y:number=0, dragType:DragType=DragType.None) {
    if(window) {
      this.selectedWindow = this.windowMap.get(window.id) || null
      this.resortWindows(window);
      this.setMoveOffset(x,y,dragType);
      console.log(`selected window #${window.id}`);
    }
    else {
      this.setMoveOffset(0, 0, DragType.None);
      this.selectedWindow = null;
      console.log(`deselected window.`);
    }
    this.dirty = false;
  }

  drag(dx:number, dy:number) {
    if(this.selectedWindow) {
      this.moveRelative(dx, dy);
    }
    else {}
  }

  addWindowFromDrag(url:string) {
    const [loadUrl, saveUrl] = drawtoolHelper.makeShared(url);
    const props:WindowProps = {
      url: loadUrl,
      index: this.lastIndex + 1,
      id: uuid(),
      width: 400,
      height: 300,
      top: 50,
      left: 50,
      title: "untitled"
    }
    // TODO: Something better than setTimeout.
    if(loadUrl != saveUrl) {
      const rewriteWindowProps = function() {
        props.url = saveUrl
        this.windowMap.set(props.id, props);
        this.selectedWindow = props;
      }.bind(this);
      setTimeout(rewriteWindowProps, 3000);
    }
    this.dirty = true;
    this.addWindow(props);
  }

  addWindow(props:WindowProps) {
    this.windowMap.set(props.id, props);
    this.selectedWindow = props;
  }

  removeWindow(window:WindowProps) {
    if(confirm("Delete this window FOREVER??")) {
      this.windowMap.delete(window.id);
      this.selectedWindow = null;
      this.dirty = true;
    }
  }

  resortWindows(last:WindowProps){
    const without:WindowProps[] = _.filter(this.windows, (w:WindowProps) => w.id != last.id)
    without.push(last);
    _.each(without, (w:WindowProps, i:number) => {
      const win = this.windowMap.get(w.id);
      if (win) {
        win.index= i;
      }
    });
  }

  @computed get lastIndex() {
    return this.windows.length-1;
  }

  @computed get windows() {
    console.log("Computation for windows being run");
    return _.sortBy(this.windowMap.values(), 'index');
  }

  @computed get draggingWindow() {

    if(this.dragType !== DragType.None) {
      return this.selectedWindow;
    }
    return null;
  }
}