
import { SharingRelay, SharableApp, PublishResponse, Context, Text, escapeFirebaseKey, SharingParamDefault, CollabSpace, PublishResponseFilter } from "cc-sharing";
import { parse } from "query-string";
import { dataStore } from "./data-store";
import { WindowProps } from "./window-manager";

declare const require:(name:string) => any;
const uuid = require("uuid");

interface Params {
  [key: string]: string
}
const params:Params = {
  sharing_offering: SharingParamDefault,
  sharing_class: SharingParamDefault,
  sharing_group: SharingParamDefault
};
const hashParams = parse(window.location.hash)
Object.keys(hashParams).forEach((key) => {
  if (params.hasOwnProperty(key)) {
    params[key] = hashParams[key]
  }
})

// This will NOT work if we keep adding iframes I think ... TBD:
const GetShareClient = function() {
  const app:SharableApp = {
    application: {
      type: CollabSpace,
      launchUrl: window.location.href,
      name: "Collaboration Space"
    },
    getDataFunc: (context:Context) => {
      const version  = uuid.v1();
      const filename:string = `thumbnails/${escapeFirebaseKey(context.offering)}/${escapeFirebaseKey(context.group)}/${escapeFirebaseKey(context.user)}/${escapeFirebaseKey(context.id)}/${version}.jpg`;
      return new Promise( (resolve, reject) => {
          resolve(
            [{type: Text, dataUrl: "Collaboration Space"}]
          )
      });
    }
  }
  const context:Context = {
    protocolVersion: "1.0",
    class: params.sharing_class,
    group: params.sharing_group,
    id: "x",
    offering: params.sharing_offering,
    requestTime: new Date().toISOString(),
    user: "3423"
  }
  const shareClient = new SharingRelay({app:app});

  const filterPublishResponse = (unfiltered:PublishResponse):PublishResponse => {
    unfiltered.children.forEach((child) => {
      const childWindow = dataStore.windowManager.windowMap.get(String(child.context.id))
      if (childWindow) {
        child.application.name = childWindow.title;
      }
    })
    return unfiltered;
  }

  shareClient.setPublishResponseFilter(filterPublishResponse)

  const reportResults = (publication: PublishResponse) => {
    console.log("New publication", publication);
  }

  shareClient.addPublicationListener({newPublication: reportResults});
  if(window.parent===window){
    shareClient.initializeAsTop(context);
  }
  return shareClient;
};

export const shareClient = GetShareClient();

