console.log("enter");

var bleno = require("bleno");
var data = require("./data.json");

process.env["BLENO_ADVERTISING_INTERVAL"] = data.advertisingInterval; //set advertising interval
process.env["BLENO_DEVICE_NAME"] = "ipleiria";

bleno.on("stateChange", onStateChange);

var major = 0; // 0x0000 - 0xffff
var minor = 0; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127

function onStateChange(state) {
  console.log("State is " + state);

  if (state === "poweredOn") {
    //read json file

    console.log(
      "current uid:" + joinIBeaconUUID(data.iBeaconUUID_1, data.iBeaconUUID_2)
    );

    bleno.startAdvertisingIBeacon(
      joinIBeaconUUID(data.iBeaconUUID_1, data.iBeaconUUID_2),
      major,
      minor,
      measuredPower,
      onStartAdverstising
    );
  }
}

function onStartAdverstising(error) {
  if (error) {
    console.error(error);
  } else {
    const advTime = process.env["BLENO_ADVERTISING_INTERVAL"]
      ? process.env["BLENO_ADVERTISING_INTERVAL"]
      : 100; //100ms is default

    console.log("Advertising iBeacon Packets");
    console.log(
      "UUID to advertise: " +
        joinIBeaconUUID(data.iBeaconUUID_1, data.iBeaconUUID_2)
    );
    console.log("AdvInterval: " + advTime + "ms");
  }
}

function joinIBeaconUUID(part1, part2) {
  return part1 + part2;
}
