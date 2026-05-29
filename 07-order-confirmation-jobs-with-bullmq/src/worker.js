import { Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Job ${job.id} completed`);
  },

  { connection },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});
