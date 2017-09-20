
import { SharingRelay, SharableApp, PublishResponse, Context, Text} from "cc-sharing";
declare const require:(name:string) => any;
const uuid = require("uuid");

// This will NOT work if we keep adding iframes I think ... TBD:
const GetShareClient = function() {
  const app:SharableApp = {
    application: {
      launchUrl: window.location.href,
      name: "Collaboration Space (demo)"
    },
    getDataFunc: (context:Context) => {
      const version  = uuid.v1();
      const filename:string = `thumbnails/${context.offering.id}/${context.group.id}/${context.user.id}/${context.localId}/${version}.jpg`;
      return new Promise( (resolve, reject) => {
          resolve(
            [{type: Text, dataUrl: "From the collaboration space"}]
          )
      });
    }
  }
  const context:Context = {
    protocolVersion: "1.0",
    clazz: { displayName: "Noahs class", id: "3423" },
    group: { displayName: "Noahs group", id: "3423" },
    id: "x",
    localId: "xx",
    offering: { displayName: "Noah Offering", id: "3423" },
    requestTime: new Date().toISOString(),
    user: { displayName: "Noah", id: "3423" }
  }
  const shareClient = new SharingRelay({app:app});

  const reportResults = (publication: PublishResponse) => {
    console.log(publication);
  }

  shareClient.addPublicationListener({newPublication: reportResults});
  shareClient.initializeAsTop(context);
  return shareClient;
};

export const shareClient = GetShareClient();