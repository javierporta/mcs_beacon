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
};
