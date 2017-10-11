import { dataStore } from "./data-store";
import { observable, autorun } from "mobx";
import { firebaseImp } from "./firebase-imp";

import * as QueryString from "query-string";
const _ = require("lodash");

export class Router {
  @observable params:any

  constructor(){
    this.parseHash();
    window.addEventListener("hashchange", this.parseHash.bind(this));

    firebaseImp.onInit(() => autorun(this.setSessionVars.bind(this)));
  }

  parseHash() {
    this.params = QueryString.parse(location.hash);
  }

  setSessionVars() {
    const keys = _.keys(this.params);
    const values = _.map(keys, (k:string) => `${k}=${this.params[k]}`);
    if(this.params.sessionTemplate) {
      firebaseImp.sessionTemplate=this.params.sessionTemplate;
    }
    if(this.params.session) {
      firebaseImp.session=this.params.session;
    }
  }

  updateHashParam(key:string, value:string) {
    const qparams = QueryString.parse(location.hash);
    this.params[key]=value;
    const stringified = QueryString.stringify(qparams);
    window.location.hash = stringified;
  }
}

export const router = new Router();