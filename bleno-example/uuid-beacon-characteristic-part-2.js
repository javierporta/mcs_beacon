var util = require("util");
var bleno = require("bleno");
var tools = require("./tools");

var BlenoCharacteristic = bleno.Characteristic;

var jsonFile = {};
const propertyReadableWritable = "iBeaconUUID_2";
var UuidIBeaconCharacteristicPart2 = function () {
  UuidIBeaconCharacteristicPart2.super_.call(this, {
    uuid: "2901",
    properties: ["read", "write", "notify"],
    value: null,
  });

  //read json file
  tools.readJsonFile("./data.json", (err, jsonData) => {
    if (err) {
      console.log(err);
      return;
    }
    jsonFile = jsonData;
    console.log(
      "Property to expose as charactesitic is: " +
        propertyReadableWritable +
        " = " +
        jsonFile[propertyReadableWritable]
    );

    this._value = new Buffer(jsonFile[propertyReadableWritable]);
    this._updateValueCallback = null;
  });
};

util.inherits(UuidIBeaconCharacteristicPart2, BlenoCharacteristic);

UuidIBeaconCharacteristicPart2.prototype.onReadRequest = function (
  offset,
  callback
) {
  console.log("Reading: " + propertyReadableWritable + ": ");
  console.log(tools.hex2a(this._value.toString("hex")));

  callback(this.RESULT_SUCCESS, this._value);
};

UuidIBeaconCharacteristicPart2.prototype.onWriteRequest = function (
  data,
  offset,
  withoutResponse,
  callback
) {
  this._value = data;

  console.log(
    "Writing" + propertyReadableWritable + ": " + this._value.toString("hex")
  );

  console.log("As text: " + tools.hex2a(this._value.toString("hex")));

  jsonFile.test = tools.hex2a(this._value.toString("hex"));

  tools.writeJsonFile("./data.json", jsonFile);

  if (this._updateValueCallback) {
    console.log(propertyReadableWritable + " - onWriteRequest: notifying");

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = UuidIBeaconCharacteristicPart2;
