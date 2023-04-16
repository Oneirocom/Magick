// Note imports.
const path = require("path");
const fs = require("fs");


// Define interface for server information.
export interface IServerInfo {
  smtp : {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  },
  imap : {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  }
}


// The configured server info.
export let serverInfo: IServerInfo;


// Read in the server information file.
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);
console.log("ServerInfo: ", serverInfo);
