class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          return resolve(task);
        } catch (err) {
          return reject(err);
        }
      });
      process.nextTick(this.next.bind(this));
    });
  }

  async next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      await task();
      this.running--;
      this.next();
      this.running++;
    }
  }
}

module.exports = TaskQueue;
