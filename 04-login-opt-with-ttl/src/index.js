import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  if (!phone.match(/^\d{10}$/)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 30); // OTP expires in 30 sec

  console.log(`OTP for ${phone}: ${otp}`);

  res.json({ phone, otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  await redis.del(otpKey(phone)); // OTP is single-use

  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const ttl = await redis.ttl(otpKey(phone));

  res.status(200).json({ phone, ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
