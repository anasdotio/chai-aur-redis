import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  /** problems
   * 1. No retry mechanism: If an email job fails during processing, it will be lost since it's removed from the queue. Implementing a retry mechanism or moving failed jobs to a separate "failed" queue can help address this issue.
   * 2. Job ordering: Using LPUSH and RPOP ensures that jobs are processed in the order they were added, but if multiple workers are processing jobs simultaneously
   * 3 .Job loss: If the server crashes after popping a job but before processing it, that job will be lost. Implementing a more robust job management system, such as using a message broker or a database to track job statuses, can help mitigate this risk.
   * 4. Parallel workers: If you have multiple workers processing jobs from the same queue, there is a possibility of race conditions where multiple workers might pop the same job. Implementing a locking mechanism or using a more advanced queue system can help prevent this issue.
   */

  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body || "No Body",
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res
    .status(200)
    .json({ message: "Email job added to the queue", enqueuedJob: job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);

  if (!rawJob) {
    return res.status(200).json({ message: "No email jobs in the queue" });
  }

  const job = JSON.parse(rawJob);

  // Simulate email sending (replace with actual email sending logic)

  console.log(`Processing email job: To=${job.to}, Subject=${job.subject}`);

  res.status(200).json({ message: "Email job processed", processedJob: job });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
