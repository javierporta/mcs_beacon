const exec = require("child_process").exec;
var data = require("./data.json");



function getTime() {
  let date_ob = new Date();
  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  return `${hours}:${minutes}:${seconds}`
}

function runEddystoneBeacon(exec) {
  console.log(`exec runEddystoneBeacon ${getTime()}`);
  exec("npm run eddystoneBeacon", (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function runIBeacon(exec) {
  console.log(`exec runIBeacon ${getTime()}`);
  exec("npm run iBeaconBeacon", (err, stdout, stderr) => {
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
  exec("npm run connectable", (err, stdout, stderr) => {
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
  refreshIntervalIdEddystone = setInterval(
    runEddystoneBeacon,
    parseInt(data.beaconIntervalTime) * 2,
    exec
  );

  await timeout(parseInt(data.beaconIntervalTime));

  refreshIntervalIdBeacon = setInterval(
    runIBeacon,
    parseInt(data.beaconIntervalTime) * 2,
    exec
  );
  console.log("Broadcasting, press any key to end");
  await keypress();

  console.log("bye");

  clearInterval(refreshIntervalIdEddystone);
  clearInterval(refreshIntervalIdBeacon);
  hciconfigReset(exec);
})().then(process.exit);

//do something when app is closing
process.on('exit', exitHandler.bind());

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind());

function exitHandler() {
  console.log("cleanup")
  exec("sudo pkill 'node'", (err, stdout, stderr) => {

  });

  process.exit();
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
