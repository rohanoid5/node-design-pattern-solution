const fs = require("fs");

const concatFiles = (dest, cb, ...srcFiles) => {
  const iterate = (idx) => {
    if (idx === srcFiles.length) {
      return cb();
    }

    return readFile(srcFiles[idx], dest, (err) => {
      if (err) {
        return cb(err);
      }

      iterate(idx + 1);
    });
  };

  iterate(0);
};

const readFile = (srcFileName, destFileName, cb) => {
  fs.readFile(srcFileName, function read(err, data) {
    if (err) {
      return cb(err);
    }
    return writeFile(destFileName, data, cb);
  });
};

const writeFile = (fileName, data, cb) => {
  fs.writeFile(fileName, data, { flag: "a" }, cb);
};

concatFiles(
  "result.txt",
  () => {
    console.log("File concatenation complete!");
  },
  "foo.txt",
  "bar.txt",
  "zoop.txt"
);
