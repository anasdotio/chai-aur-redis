import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import Product from "./models/productSchema.js";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.status(200).json({ message: reply });
});

app.get("/products", async (req, res) => {
  const cachedProducts = await redis.get("products");

  if (cachedProducts) {
    console.log("cached hit");
    return res.status(200).json({ products: JSON.parse(cachedProducts) });
  }

  console.log("cached miss");

  const products = await Product.find();

  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }

  await redis.set("products", JSON.stringify(products));

  res.status(200).json({ products });
});

const start = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/chai_aur_redis",
    );
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

start();
