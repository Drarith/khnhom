import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/myEnv.js";

import type { CloudinaryUploadResponse } from "../types/cloudinary.js";

export async function uploadBase64ToCloudinary(
  base64Data: string,
  publicId: string,
  folder: string = "qrcodes"
): Promise<CloudinaryUploadResponse> {
  const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;

  if (!CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials not configured");
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const response = await cloudinary.uploader.upload(base64Data, {
      public_id: publicId,
      folder: folder,
      invalidate: true,
    });

    return response as CloudinaryUploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
