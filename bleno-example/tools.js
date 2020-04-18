const fs = require("fs");

module.exports = {
  readJsonFile: function (filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  },
  writeJsonFile: function (fileName, data) {
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  },
  hex2a: function (hex) {
    var hex = hex.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  },
};
