import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Profile from "../model/profileModel.js";
import { env } from "../config/myEnv.js";

const JWT_SECRET = env.JWT_SECRET;

function getTokenFromRequest(req: Request): string | null {
  const cookieToken = (req as any).cookies?.auth_token; 
  if (cookieToken) return cookieToken;

  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
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
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, userPayload) => {
    if (err) {
      if ((err as any).name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = userPayload as any;


    if (userPayload && typeof userPayload === "object" && "id" in userPayload) {
      try {
        const profile = await Profile.findOne({ user: (userPayload as any).id });
        if (profile) {
          req.profile = profile;
        }
      } catch (e) {
        console.error("Error fetching profile in authenticateToken:", e);
      }
    }

    next();
  });
};