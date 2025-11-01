import dotenv from "dotenv";
dotenv.config();

export const env = {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "",
  GOOGLE_SB_API: process.env.GOOGLE_SB_API || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
};