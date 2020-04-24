const exec = require('child_process').exec;

function runEddystoneBeacon(exec) {
    console.log(`exec runEddystoneBeacon`);
    exec('node eddystone-beacon.js', (err, stdout, stderr) => {
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
    exec('node ibeacon.js', (err, stdout, stderr) => {
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
  exec('hciconfig hci0 reset', (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
    
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
}

setInterval(runEddystoneBeacon, 1500, exec);
setInterval(runIBeacon, 1500, exec);