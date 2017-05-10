import { v1 as uuid } from "uuid";
import * as QueryString from "query-string";

const DrawToolUrl = "http://codraw.concord.org/";
const firebaseKeyParam = "firebaseKey";
const newKeyParam = "newKey"

export class DrawtoolHelper {
  constructor(){}

  openNewDrawtool(){
    const url =`${DrawToolUrl}?${firebaseKeyParam}=${uuid()}`;
    window.open(url, "_blank");
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