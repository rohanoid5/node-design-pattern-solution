const TaskQueue = require("./TaskQueue");
const taskQueue = new TaskQueue(2);

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Delayed after ${ms} ms`);
    }, ms);
  });
};

taskQueue.runTask(delay(2000)).then((res) => {
  console.log(res);
});
taskQueue.runTask(delay(3000)).then((res) => {
  console.log(res);
});
taskQueue.runTask(delay(4000)).then((res) => {
  console.log(res);
});
taskQueue.runTask(delay(5000)).then((res) => {
  console.log(res);
});
