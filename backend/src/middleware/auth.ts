import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Profile from "../model/profileModel.js";
import { env } from "../config/myEnv.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

const JWT_SECRET = env.JWT_SECRET;

function getTokenFromRequest(req: Request): string | null {
  // Check for new access_token cookie first
  const accessToken = (req as any).cookies?.access_token;
  if (accessToken) return accessToken;

  // const refreshToken = (req as any).cookies?.refresh_token;
  // if (refreshToken) return refreshToken;

  // Fallback to old auth_token for backward compatibility
  // const cookieToken = (req as any).cookies?.auth_token;
  // if (cookieToken) return cookieToken;

  // Check Authorization header
  // For testing with postman
  // const authHeader = req.headers["authorization"];
  // if (authHeader?.startsWith("Bearer ")) {
  //   return authHeader.slice("Bearer ".length);
  // }
  return null;
}

//** Authentication middleware */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      code: "TOKEN_EXPIRED",
    });
  }

  try {
    // decode token with jwt.verify from jwt.sign
    const userPayload = verifyAccessToken(token);
    req.user = userPayload as IUser;

    // Fetch profile if user ID exists
    if (userPayload && userPayload.id && !req.profile) {
      try {
        const profile = await Profile.findOne({ user: userPayload.id });
        if (profile) {
          req.profile = profile;
        }
      } catch (e) {
        console.error("Error fetching profile in authenticateToken:", e);
      }
    }

    next();
  } catch (err) {
    if ((err as any).name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }
    if ((err as any).name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({ message: "Invalid token", code: "TOKEN_INVALID" });
    }
    return res.status(403).json({ message: "Token verification failed" });
  }
};
