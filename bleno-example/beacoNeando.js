const exec = require("child_process").exec;
var data = require("./data.json");

function runEddystoneBeacon(exec) {
  console.log(`exec runEddystoneBeacon`);
  exec("node eddystoneBeacon.js", (err, stdout, stderr) => {
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
  exec("node iBeaconBeacon.js", (err, stdout, stderr) => {
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
  exec("node connect.js", (err, stdout, stderr) => {
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
  //1. Broadcast mode
  var refreshIntervalIdEddystone = setInterval(
    runEddystoneBeacon,
    parseInt(data.beaconIntervalTime) * 2,
    exec
  );

  await timeout(parseInt(data.beaconIntervalTime));

  var refreshIntervalIdBeacon = setInterval(
    runIBeacon,
    parseInt(data.beaconIntervalTime) * 2,
    exec
  );

  console.log("Broadcasting, press any key to continue");
  await keypress();

  //2. Connecatble mode
  clearInterval(refreshIntervalIdEddystone);
  clearInterval(refreshIntervalIdBeacon);
  runConnectable();
  console.log("Connectable mode, press any key to continue");
  await keypress();

  //3. Broadcast mode
  setInterval(runEddystoneBeacon, parseInt(data.beaconIntervalTime) * 2, exec);

  await timeout(parseInt(data.beaconIntervalTime));

  setInterval(runIBeacon, parseInt(data.beaconIntervalTime) * 2, exec);
  console.log("Broadcasting, press any key to end");
  await keypress();

  console.log("bye");
})().then(process.exit);

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
