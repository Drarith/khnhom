import dotenv from "dotenv";
dotenv.config();

type Env = {
  MONGO_URI: string;
  PORT: number;
  JWT_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  GOOGLE_SB_API: string;
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FRONTEND_URL: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_URL: string;
  PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT: string;
  BASE_URL: string;
};

export const env: Env = {
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET || "",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "",
  GOOGLE_SB_API: process.env.GOOGLE_SB_API || "",
  NODE_ENV: process.env.NODE_ENV || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
  PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT:
    process.env.PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT || "",
  BASE_URL: process.env.BASE_URL || "",
};
