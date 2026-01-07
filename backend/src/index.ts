import express from "express";
import mongoose from "mongoose";

import passport from "passport";

import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import cors from "cors";

import { v2 as cloudinary } from "cloudinary";

import userRouter from "./routes/userRoute.js";
import profileRouter from "./routes/profileRoute.js";
import cloudinaryRouter from "./routes/cloudinary.js";
import helmet from "helmet";
// import khqrRouter from "./routes/khqrRoute.js";
import { env } from "../src/config/myEnv.js";

import rateLimit from "./middleware/rateLimit.js";

dotenv.config();

// Initialize the Express application
const app = express();
const PORT = env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "REFRESH_TOKEN_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https://res.cloudinary.com"],
      },
    },
  })
);

// rate limit middleware
app.use(rateLimit);

// User routes
app.use(userRouter);

// Cloudinary routes
app.use(cloudinaryRouter);

// Profile routes
app.use(profileRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});