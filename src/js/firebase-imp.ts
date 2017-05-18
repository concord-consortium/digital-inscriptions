const firebase = require("firebase");
import { v1 as uuid } from "uuid";
const DEFAULT_SESSION = "default";
const DEFAULT_VERSION_STRING = "1.0.0";
const DEFAULT_ACTIVITY = "default";
const LOCAL_SESSION_KEY= "DigitalInscriptsionSession"

interface Presence {
  [key: string]: any
}

interface FirebaseUser {
  displayName:string
}

interface FirebaseError {
  message: string
  email: string
}

interface FirebaseLinstener {
  setState(state:any):void
}

interface FirebaseData {
  val():any
}
interface FirebaseDisconnectSerivce {
  remove():void
}

interface FirebaseRef {
  off(event:string):void
  off():void
  on(event:string, callback:Function):void
  onDisconnect():FirebaseDisconnectSerivce
  remove():void
  update(data:any):void
}

interface FireBaseConfig {
  [key:string]: string
}

class FirebaseImp {
  _session:string
  _activity:string
  sessionID: string
  user: FirebaseUser
  version: string
  listeners:FirebaseLinstener[]
  config: FireBaseConfig
  connectionStatus: FirebaseRef
  dataRef: FirebaseRef
  userRef: FirebaseRef

  constructor() {
    this._session = `${DEFAULT_SESSION}_${DEFAULT_VERSION_STRING.replace(/\./g, "_")}`;
    this.activity = DEFAULT_ACTIVITY;
    this.version  = DEFAULT_VERSION_STRING;

    this.config = {
      apiKey: "AIzaSyBo36Ni0UPABpIHu6VtBPMSJyb8RVPAYl4",
      authDomain: "digital-inscriptions.firebaseapp.com",
      databaseURL: "https://digital-inscriptions.firebaseio.com",
      projectId: "digital-inscriptions",
      storageBucket: "digital-inscriptions.appspot.com",
      messagingSenderId: "205530147288"
    };
    this.listeners = [];
    this.sessionID = localStorage.getItem(LOCAL_SESSION_KEY) || uuid();
    localStorage.setItem(LOCAL_SESSION_KEY, this.sessionID);
  }

  log(msg:string){
    console.log(msg);
  }

  error(err:string) {
    console.error(err);
  }

  initFirebase(callback:Function) {
    firebase.initializeApp(this.config);
    const finishAuth = this.finishAuth.bind(this);
    const reqAuth    = this.reqAuth.bind(this);
    const log        = this.log.bind(this);
    let auth = firebase.auth();
    auth.onAuthStateChanged(function(user:FirebaseUser) {
      if (user) {
        log(user.displayName + " authenticated");
        finishAuth({result: {user: user}});
        callback();
      } else {
        reqAuth();
      }
    });
  }

  reqAuth() {
    // To re-enable google authentication:
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithRedirect(provider)
    firebase.auth().signInAnonymously()
    .then(this.finishAuth.bind(this))
    .catch(this.failAuth.bind(this));
  }

  failAuth(error:FirebaseError) {
    var errorMessage = error.message;
    const email = error.email;
    this.error(["could not authenticate", errorMessage, email].join(" "));
  }

  finishAuth(result:{user:FirebaseUser}) {
    this.user = result.user;
    this.setDataRef();
    this.log("logged in");
  }

  setDataRef() {
    if(firebase.database()) {
      this.rebindFirebaseHandlers();
      this.setupPresence();
    }
  }

  set session(sessionName:string) {
    this._session = sessionName;
    this.setDataRef();
  }

  get session() {
    return this._session;
  }

  set activity(activityName:string) {
    this._activity = activityName;
  }

  get activity() {
    return this._activity;
  }

  setupPresence() {
    // Remove old user listening:
    if(this.connectionStatus) { this.connectionStatus.off(); }
    if(this.userRef)  {
      this.userRef.off();
      this.userRef.remove();
    }

    this.connectionStatus = firebase.database().ref(".info/connected");
    this.userRef = firebase.database().ref(`${this.session}/presence/${this.sessionID}`);

    const userRef = this.userRef;
    const log = this.log.bind(this);
    const updateUserData = this.saveUserData.bind(this);
    this.connectionStatus.on("value", function(snapshot:any) {
      log("online -- ");
      updateUserData({
        oneline: true,
        start: new Date(),
        name: "(no name)"
      });
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
      }
    });
  }

  rebindFirebaseHandlers () {
    this.log("registering listeners");
    if(this.dataRef) {
      try {
        this.dataRef.off();
      }
      catch(e) {
        this.log("couldn't disable previous data handler");
      }
    }
    this.dataRef = firebase.database().ref(this.session);
    const setData = this.loadDataFromFirebase.bind(this);
    const log = this.log.bind(this);
    this.dataRef.on("value", setData);
  }

  addListener(listener:FirebaseLinstener) {
    this.listeners.push(listener);
  }

  removeListener(listener:FirebaseLinstener) {
    const oldListeners = this.listeners;
    this.listeners = oldListeners.filter((el) => el !== listener);
  }

  saveToFirebase(data:any) {
    if(this.dataRef && this.dataRef.update){
      this.dataRef.update(data);
    }
  }

  saveUserData(data:Presence) {
    if(this.userRef && this.userRef.update){
      this.userRef.update(data);
    }
  }

  loadDataFromFirebase(data:FirebaseData) {
    const dataV = data.val();
    for(let listener of this.listeners) {
      listener.setState(dataV);
    }
  }
}

export const firebaseImp = new FirebaseImp();