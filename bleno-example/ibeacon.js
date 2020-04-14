console.log("enter");

var bleno = require("bleno");

process.env["BLENO_ADVERTISING_INTERVAL"] = 100;

bleno.on("stateChange", onStateChange);

var uuid = "e2c56db5dffb48d2b060d0f5a71096e0";
var major = 0; // 0x0000 - 0xffff
var minor = 0; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127

function onStateChange(state) {
  console.log("State is " + state);

  if (state === "poweredOn") {
    bleno.startAdvertisingIBeacon(
      uuid,
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
    console.log("Started advertising");
  }
}
