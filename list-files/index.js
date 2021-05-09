const fs = require("fs");
const path = require("path");
const absolutePath = path.resolve(process.argv[2]);

let activeDir = 0;
let foundFiles = [];

const listNestedFiles = (dir, cb) => {
  readDir(dir, (err, files) => {
    if (err) {
      return cb(err);
    }

    return cb(null, files);
  });
};

const readDir = (dir, cb) => {
  activeDir++;

  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return cb(err);
    }

    files.forEach((file) => {
      if (file.isDirectory()) {
        readDir(path.join(dir, `/${file.name}`), cb);
      } else {
        foundFiles.push(path.join(dir, `/${file.name}`));
      }
    });

    activeDir--;

    if (activeDir <= 0) {
      return cb(null, foundFiles);
    }
  });
};

listNestedFiles(absolutePath, (err, foundFiles) => {
  if (err) {
    return console.log(err);
  }

  if (foundFiles) {
    foundFiles.forEach((file) => {
      console.log(file);
    });
  }

  console.log("Iteration complete");
});
