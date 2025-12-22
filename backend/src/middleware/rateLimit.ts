import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

const USERNAME = process.env.USERNAME || "";
const PASSWORD = process.env.PASSWORD || "";
const SOCKET_HOST = process.env.SOCKET_HOST || "";
const PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;

const client = createClient({
  username: USERNAME,
  password: PASSWORD,
  socket: {
    host: SOCKET_HOST,
    port: PORT,},
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

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
