// import { dataStore } from "./data-store";
// import { observable, autorun } from "mobx";
import { v1 as uuid } from "uuid";

const DrawToolUrl = "http://msu-drawtool.surge.sh/index.html";

export class DrawtoolHelper {
  constructor(){
  }

  handleClick(e:any){
    debugger
    e.target.href = `${DrawToolUrl}?firebaseKey=${uuid()}`;
  }
}

export const drawtoolHelper = new DrawtoolHelper();