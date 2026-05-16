import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.status(200).json({ message: "User profile cached as JSON" });
});

app.get("/user/:id/json", async (req, res) => {
  const userProfile = await redis.get(`user:${req.params.id}:json`);
  if (userProfile) {
    res.status(200).json(JSON.parse(userProfile));
  } else {
    res.status(404).json({ message: "User profile not found" });
  }
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.status(200).json({ message: "User profile cached as Hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userProfile = await redis.hgetall(`user:${req.params.id}:hash`);
  if (userProfile) {
    res.status(200).json(userProfile);
  } else {
    res.status(404).json({ message: "User profile not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
