import { type Request, type Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/myEnv.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

export const cloudinaryUploadSignature = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = (req.user as IUser).id;

  if (!userId) {
    return res
      .status(400)
      .send({ message: "User ID is required for signed upload." });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  //With this approach, each new upload overwrites the previous one
  const publicId = `user_${userId}_profile`;

  const params_to_sign = {
    timestamp: timestamp,
    folder: "profile_pictures",
    public_id: publicId,
  };

  try {
    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      env.CLOUDINARY_API_SECRET
    );
    console.log("DONE")
    return res.status(200).json({
      signature: signature,
      timestamp: timestamp,
      publicId: publicId,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during signature generation." });
  }
};
