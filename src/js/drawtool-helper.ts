import { v1 as uuid } from "uuid";
import * as QueryString from "query-string";
import { dataStore } from "./data-store";

const DrawToolUrl = "http://codraw.concord.org/";
const firebaseKeyParam = "firebaseKey";
const newKeyParam = "newKey"

export class DrawtoolHelper {
  constructor(){}

  openNewPrivateDrawtool(){
    const url =`${DrawToolUrl}?${firebaseKeyParam}=${uuid()}`;
    window.open(url, "_blank");
  }

  makePrivate(url:string) {
    window.open(`${url}&makeCopy=true`, "_blank");
  }

  openPrivateCopy() {
    const win = dataStore.windowManager.selectedWindow;
    if(win && win.url) {
      this.makePrivate(win.url);
    }
  };

  isDawTool(url:string) {
    if(url.match(/http:\/\/codraw.concord.org/)) {
      return true;
    }
    return false;
  }

  openNewSharedDrawtool(){
    const id = uuid();
    const url =`${DrawToolUrl}?${firebaseKeyParam}=${id}`;
    const windowManager = dataStore.windowManager;
    const props = {
      id: id,
      index: windowManager.lastIndex + 1,
      top: 100,
      left: 100,
      width: 500,
      height: 400,
      url: url,
      title: "shared drawing"
    }
    windowManager.addWindow(props);
  }

  makeShared(url:string) {
    let [address, query] = url.split("?");
    let loadUrl = url;
    let saveUrl = url;
    if(query && query.length > 0) {
      let params = QueryString.parse(query);
      let firebaseKey = params.firebaseKey;
      if(firebaseKey) {
        params.newKey = uuid();
        query = QueryString.stringify(params);
        loadUrl = [address, query].join("?");
        params.firebaseKey = params.newKey;
        delete params.newKey;
        query = QueryString.stringify(params);
        saveUrl = [address, query].join("?");
      }
    }
    return [loadUrl, saveUrl];
  }

}

export const drawtoolHelper = new DrawtoolHelper();