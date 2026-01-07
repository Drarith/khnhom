import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { client, connectRedis } from "../config/redisClient.js";

await connectRedis();

// Create and use the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
  }),
});

export default limiter;
