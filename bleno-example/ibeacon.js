console.log("enter");

var bleno = require("bleno");
var tools = require("./tools");

process.env["BLENO_ADVERTISING_INTERVAL"] = 100;
process.env["BLENO_DEVICE_NAME"] = "java server ble";

var jsonFile = {};

bleno.on("stateChange", onStateChange);

var major = 0; // 0x0000 - 0xffff
var minor = 0; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127

function onStateChange(state) {
  console.log("State is " + state);

  if (state === "poweredOn") {
    //read json file
    tools.readJsonFile("./data.json", (err, jsonData) => {
      if (err) {
        console.log(err);
        return;
      }
      jsonFile = jsonData;
      console.log("current uid:" + jsonFile.iBeaconUID);

      bleno.startAdvertisingIBeacon(
        jsonFile.iBeaconUID,
        major,
        minor,
        measuredPower,
        onStartAdverstising
      );
    });
  }
}

function onStartAdverstising(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Started advertising");
  }
}
