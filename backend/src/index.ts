import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";

import type { Env } from "./types/myENV.js";

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

const env: Env = {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: Number(process.env.PORT) || 3000,
};

// Connect to MongoDB
mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("[database]: Connected to MongoDB");
  })
  .catch((error) => {
    console.error("[database]: Error connecting to MongoDB", error);
  });

app.use(express.urlencoded({ extended: true }));

// Define a simple route
app.get("/", async (req, res) => {

  res.send("Hello from Express + TypeScript ");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
