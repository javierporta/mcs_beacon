var bleno = require("bleno");

process.env["BLENO_ADVERTISING_INTERVAL"] = 200;

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require("./characteristic");

console.log("bleno - echo");

bleno.on("stateChange", function (state) {
  console.log("on -> stateChange: " + state);

  if (state === "poweredOn") {
    bleno.startAdvertising("echo", ["ec00"]);
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
        characteristics: [new EchoCharacteristic()],
      }),
    ]);
  } else {
    bleno.stopAdvertising();
    bleno.startAdvertising("echo", ["ec00"]);
  }
});

bleno.on("advertisingStop", function () {
  console.log("on -> advertisingStop: ");
});

bleno.on("disconnect", function (clientAddress) {
  console.log("Client " + clientAddress + " disconnected");

  //restart node here¡
});
