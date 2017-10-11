import { observable, computed, autorun, action} from "mobx";
import { v1 as uuid } from "uuid";
import { firebaseImp } from "./firebase-imp";
import { WindowManager, WindowMap, WindowProps, DragType} from "./window-manager";
import { router, Router} from "./router";

const _ = require("lodash");

enum AppStatus { Starting, Loading, Ready }

interface AppState {
  [key:string]: any
}

class DataStore {
  @observable appStatus: AppStatus
  windowManager: WindowManager = new WindowManager();
  router: Router = router;
  constructor() {
    this.registerFirebase();
    this.appStatus = AppStatus.Starting
    firebaseImp.onLoad(() => {
      autorun(this.saveWindowMap.bind(this))
    })
  }

  registerFirebase() {
    firebaseImp.addListener(this);
    this.setAppStatus(AppStatus.Loading);
    firebaseImp.initFirebase( ()=> {
      this.setAppStatus(AppStatus.Ready);
    });
  }

  setAppStatus(_new:AppStatus) {  this.appStatus = _new; }

  setState(state:any) {
    if(state.windowMap){
      this.windowManager.setState(state.windowMap);
    }
  }

  saveWindowMap() {
    // Only send DB changes that originate from the UI:
    if(this.windowManager.dirty) {
      this.windowManager.dirty=false;
      const data = this.windowManager.windowMap.toJS();
      this.saveToPath('windowMap', data);
    }
  }

  saveToPath(key:string, value:any) {
    const obj:any = {};
    obj[key] = value;
    firebaseImp.saveToFirebase(obj);
  }

  save(obj:any){
    firebaseImp.saveToFirebase(obj);
  }

  unregisterFirebase() {
    firebaseImp.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }
}

export const dataStore = new DataStore();