import express from "express";
import mongoose from "mongoose";

import passport from "passport";
import session from "express-session";

import dotenv from "dotenv";

import type { Env } from "./types/myENV.js";

import userRouter from "./routes/userRoute.js";

dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

const env: Env = {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: Number(process.env.PORT) || 3000,
};

// Configure session middleware

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

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

// User routes
app.use(userRouter);


app.get("/", async (req, res) => {

  res.send("Hello from Express + TypeScript ");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
