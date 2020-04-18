var util = require("util");
var bleno = require("bleno");
var tools = require("./tools");

var BlenoCharacteristic = bleno.Characteristic;

var jsonFile = {};
var EchoCharacteristic = function () {
  EchoCharacteristic.super_.call(this, {
    uuid: "ec0e",
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
    console.log("my data test:" + jsonFile.test);

    this._value = Buffer.from(jsonFile.test);
    this._updateValueCallback = null;
  });
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function (offset, callback) {
  console.log(
    "EchoCharacteristic - onReadRequest: value = " + this._value.toString("hex")
  );
  console.log(hex2a(this._value.toString("hex")));

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function (
  data,
  offset,
  withoutResponse,
  callback
) {
  this._value = data;

  console.log(
    "EchoCharacteristic - onWriteRequest: value = " +
      this._value.toString("hex")
  );

  console.log("Writing as text: " + hex2a(this._value.toString("hex")));

  jsonFile.test = hex2a(this._value.toString("hex"));

  console.log("data test is");
  console.log(jsonFile.test);

  //write json
  tools.writeJsonFile("./data.json", jsonFile);

  // try {
  //   //todo: check it must be a number
  //   var newIntervalTime = hex2a(this._value.toString("hex"));

  //   //process.env["BLENO_ADVERTISING_INTERVAL"] = newIntervalTime;

  //   console.log("new advtime: " + process.env["BLENO_ADVERTISING_INTERVAL"]);

  //   bleno.disconnect();
  // } catch (error) {
  //   console.error(error);
  // }

  if (this._updateValueCallback) {
    console.log("EchoCharacteristic - onWriteRequest: notifying");

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function (
  maxValueSize,
  updateValueCallback
) {
  console.log("EchoCharacteristic - onSubscribe");

  this._updateValueCallback = updateValueCallback;
};

EchoCharacteristic.prototype.onUnsubscribe = function () {
  console.log("EchoCharacteristic - onUnsubscribe");

  this._updateValueCallback = null;
};

//ToDO:
//from here put in other file

function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

module.exports = EchoCharacteristic;
