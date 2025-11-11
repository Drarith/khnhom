import express from "express";
import mongoose from "mongoose";

import passport from "passport";

import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import cors from "cors";

import userRouter from "./routes/userRoute.js";
import profileRouter from "./routes/profileRoute.js";
import { env } from "../src/config/myEnv.js";

dotenv.config();

// Initialize the Express application
const app = express();
const port = env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// cookie parse middleware
app.use(cookieParser());

// Initialize Passport.js
app.use(passport.initialize());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

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
app.use(express.json());
app.use(express.json({ limit: "100kb" }));

// User routes
app.use(userRouter);

// Profile routes
app.use(profileRouter);

app.get("/", async (req, res) => {
  res.send("Hello from Express + TypeScript!!!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
