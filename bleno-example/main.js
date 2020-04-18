var bleno = require("bleno");

process.env["BLENO_ADVERTISING_INTERVAL"] = 200;

var BlenoPrimaryService = bleno.PrimaryService;

var UuidIBeaconCharacteristicPart1 = require("./uuid-beacon-characteristic-part-1");
var UuidIBeaconCharacteristicPart2 = require("./uuid-beacon-characteristic-part-2");

console.log("bleno - echo");

bleno.on("stateChange", function (state) {
  console.log("on -> stateChange: " + state);

  if (state === "poweredOn") {
    bleno.startAdvertising("ConnectableMode", ["ec00"]);
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
