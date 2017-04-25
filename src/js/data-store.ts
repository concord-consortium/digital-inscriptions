import { observable, computed, autorun, action} from "mobx";
import { v1 as uuid } from "uuid";
import { FirebaseImp } from "./firebase-imp";
import { WindowManager, WindowMap, WindowProps, DragType} from "./window-manager";
const _ = require("lodash");

enum AppStatus { Starting, Loading, Ready }

interface AppState {
  [key:string]: any
}

class DataStore {
  @observable firebaseImp: FirebaseImp
  @observable appStatus: AppStatus
  windowManager: WindowManager = new WindowManager();
  constructor() {
    this.registerFirebase();
    this.appStatus = AppStatus.Starting
    autorun(this.saveWindowMap.bind(this));
  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    this.setAppStatus(AppStatus.Loading);
    this.firebaseImp.initFirebase( ()=> {
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
    const data = this.windowManager.windowMap.toJS();
    this.saveToPath('windowMap', data);
  }

  saveToPath(key:string, value:any) {
    const obj:any = {};
    obj[key] = value;
    this.firebaseImp.saveToFirebase(obj);
  }

  save(obj:any){
    this.firebaseImp.saveToFirebase(obj);
  }

  unregisterFirebase() {
    this.firebaseImp.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }


}

const dataStore = new DataStore();

export { dataStore };