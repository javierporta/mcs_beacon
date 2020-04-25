const exec = require("child_process").exec;
var data = require("./data.json");

function runEddystoneBeacon(exec) {
  console.log(`exec runEddystoneBeacon`);
  exec("node eddystone-beacon.js", (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function runIBeacon(exec) {
  console.log(`exec runIBeacon`);
  exec("node ibeacon.js", (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function runConnectable() {
  console.log(`exec connectable mode`);
  exec("node main.js", (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function hciconfigReset(exec) {
  console.log(`exec hciconfig hci0 reset`);
  exec("hciconfig hci0 reset", (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

(async () => {
  var refreshIntervalIdEddystone = setInterval(runEddystoneBeacon, 1500, exec);
  var refreshIntervalIdBeacon = setInterval(runIBeacon, 1500, exec);
  console.log("Broadcasting, press any key to continue");
  await keypress();

  clearInterval(refreshIntervalIdEddystone);
  clearInterval(refreshIntervalIdBeacon);
  runConnectable();
  console.log("Connectable mode, press any key to continue");
  await keypress();

  setInterval(runEddystoneBeacon, data.beaconIntervalTime, exec);
  setInterval(runIBeacon, data.beaconIntervalTime, exec);
  console.log("Broadcasting, press any key to end");
  await keypress();

  console.log("bye");
})().then(process.exit);
