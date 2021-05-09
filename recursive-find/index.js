const fs = require("fs");
const path = require("path");
const TaskQueue = require("./TaskQueue");

const absolutePath = path.resolve(process.argv[2]);
const keyWord = process.argv[3];
const concurrency_limit = process.argv[4] || 4;
const taskQueue = new TaskQueue(concurrency_limit);

const targetFiles = new Set();

const recursiveFind = (dir, keyword, queue, cb) => {
  queue.on("error", (err) => cb(err)).on("empty", () => cb(null, targetFiles));

  queue.pushTask((done) => {
    startExploringDir(dir, keyword, queue, done);
  });
};

const startExploringDir = (dir, keyword, queue, cb) => {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return cb(err);
    }

    for (let f of files) {
      let accessPath = path.join(dir, f.name);

      if (f.isDirectory()) {
        queue.pushTask((done) =>
          startExploringDir(accessPath, keyword, queue, done)
        );
      } else {
        queue.pushTask((done) => startExploringFile(accessPath, keyword, done));
      }
    }

    return cb();
  });
};

const startExploringFile = (file, keyword, cb) => {
  fs.readFile(file, "utf-8", (err, content) => {
    if (err) {
      return cb(err);
    }

    let myRegEx = new RegExp(keyword);

    if (content.match(myRegEx)) {
      targetFiles.add(file);
    }

    return cb();
  });
};

recursiveFind(absolutePath, keyWord, taskQueue, (err, files) => {
  if (err) {
    return console.log(`Error concatenating files: ${err.message}`);
  }

  console.log("Keyword found in the following files: ", files);
});
