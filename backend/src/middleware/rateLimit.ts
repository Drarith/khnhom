import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

import { env } from "../config/myEnv.js";

const USERNAME = env.REDIS_USERNAME || "";
const PASSWORD = env.REDIS_PASSWORD || "";
const HOST = env.REDIS_HOST || "";
const PORT = env.REDIS_PORT ? Number(env.REDIS_PORT) : 6379;

const client = createClient({
  username: USERNAME,
  password: PASSWORD,
  socket: {
    host: HOST,
    port: PORT,},
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  if (!client.isOpen) {
    try{
      await client.connect();
      console.log("Connected to Redis successfully");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
    }
  }
}

await connectRedis();

// Create and use the rate limiter
const limiter = rateLimit({
  // Rate limiter configuration
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Redis store configuration
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
  }),
});

export default limiter;
