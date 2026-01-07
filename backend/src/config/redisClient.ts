import { createClient } from "redis";
import { env } from "./myEnv.js";

const USERNAME = env.REDIS_USERNAME || "";
const PASSWORD = env.REDIS_PASSWORD || "";
const HOST = env.REDIS_HOST || "";
const PORT = env.REDIS_PORT ? Number(env.REDIS_PORT) : 6379;

export const client = createClient({
  username: USERNAME,
  password: PASSWORD,
  socket: {
    host: HOST,
    port: PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

export async function connectRedis() {
  if (!client.isOpen) {
    try {
      await client.connect();
      console.log("Connected to Redis successfully");
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      // Don't crash the app - just log the error
    }
  }
  return client;
}
