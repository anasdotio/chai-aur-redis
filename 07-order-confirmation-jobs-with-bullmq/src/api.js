import express from "express";
import Redis from "ioredis";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = emailQueue.add(
    "send-Welcome-Email",
    {
      to: req.body.to,
      name: req.body.name || "learner!",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({ message: "Welcome email job added to the queue", jobId: job.id });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
