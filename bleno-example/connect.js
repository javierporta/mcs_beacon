var bleno = require("bleno");

var BlenoPrimaryService = bleno.PrimaryService;

var UuidIBeaconCharacteristicPart1 = require("./uuid-beacon-characteristic-part-1");
var UuidIBeaconCharacteristicPart2 = require("./uuid-beacon-characteristic-part-2");
var AdvertisingIntervalCharacteristic = require("./advertising-interval-characteristic");
var EddystoneUrlCharacteristic = require("./eddystone-url-characteristic");
var BeaconIntervalTimeCharasteristic = require("./beacon-interval-time-characteristic");

console.log("bleno - connectable mode");

const connectionName = "BeaconConfigurator";

bleno.on("stateChange", function (state) {
  console.log("on -> stateChange: " + state);

  if (state === "poweredOn") {
    bleno.startAdvertising(connectionName, ["ec00"]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart", function (error) {
  console.log(
    "on -> advertisingStart: " + (error ? "error " + error : "success")
  );

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: "ec00",
        characteristics: [
          new UuidIBeaconCharacteristicPart1(),
          new UuidIBeaconCharacteristicPart2(),
          new AdvertisingIntervalCharacteristic(),
          new EddystoneUrlCharacteristic(),
          new BeaconIntervalTimeCharasteristic(),
        ],
      }),
    ]);
  } else {
    bleno.stopAdvertising();
    bleno.startAdvertising("ConnectableMode", ["ec00"]);
  }
});

bleno.on("advertisingStop", function () {
  console.log("on -> advertisingStop: ");
});

bleno.on("disconnect", function (clientAddress) {
  console.log("Client " + clientAddress + " disconnected");

  //restart node here¡
});
