import { v1 as uuid } from "uuid";

const DrawToolUrl = "http://msu-drawtool.surge.sh/index.html";

export class DrawtoolHelper {
  constructor(){}

  openNewDrawtool(){
    const url =`${DrawToolUrl}?firebaseKey=${uuid()}`;
    window.open(url, "_blank");
  }
}

export const drawtoolHelper = new DrawtoolHelper();