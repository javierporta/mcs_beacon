var eddystoneBeacon = require("eddystone-beacon"); // require('./../../index')
var data = require("./data.json");
var bleno = require("eddystone-beacon/node_modules/bleno");

process.env["BLENO_ADVERTISING_INTERVAL"] = data.advertisingInterval; //set advertising interval

var options = {
  name: "EddystoneBeacon", // set device name when advertising (Linux only)
  txPowerLevel: -22, // override TX Power Level, default value is -21,
  tlmCount: 2, // 2 TLM frames
  tlmPeriod: 10, // every 10 advertisements
};

var url = data.eddystoneUrl;

bleno.once("advertisingStart", function (err) {
  if (err) {
    throw err;
  }

  const advTime = process.env["BLENO_ADVERTISING_INTERVAL"]
    ? process.env["BLENO_ADVERTISING_INTERVAL"]
    : 100; //100ms is default

  console.log("Advertising Eddystone Packets");
  console.log("UrlToAdvertise: " + url);
  console.log("AdvInterval: " + advTime + "ms");
});

eddystoneBeacon.advertiseUrl(url, [options]);
