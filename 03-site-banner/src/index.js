import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  await redis.set(BANNER_KEY, message);

  res.status(200).json({ message: "Banner updated successfully" });
});

app.get("/banner", async (req, res) => {
  const bannerMessage = await redis.get(BANNER_KEY);

  if (!bannerMessage) {
    return res.status(404).json({ message: "No banner message found" });
  }

  res.status(200).json({ message: bannerMessage });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.status(200).json({ message: "Banner deleted successfully" });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);

  res.status(200).json({ exists: Boolean(exists) });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
