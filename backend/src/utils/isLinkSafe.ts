import type { Request, Response, NextFunction } from "express";
import { checkUrlSafe } from "./googleSafeBrowsing.js";

export const isUrlSafe = async (
  req: Request,
  res: Response,
  next: NextFunction,
  safeUrl: string
) => {
  let isSafe;
  try {
    isSafe = await checkUrlSafe(safeUrl);
  } catch (err) {
    return res.status(400).json({ message: "Unable to verify links safety." });
  }

  if (!isSafe) {
    return res
      .status(401)
      .json({ message: "Provided link URL is unsafe or blocked." });
  }
  next();
};
