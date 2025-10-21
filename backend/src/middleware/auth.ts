import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT SECRET NOT FOUND!");
}

// This is your "login required" function
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the token from the header
  const authHeader = req.headers["authorization"];
  // The header format is "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Check if the token exists
  if (token == null) {
    // 401 Unauthorized
    return res.status(401).json({ message: "No token provided" });
  }

  // 3. Verify the token
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      // 403 Forbidden (token is no longer valid)
      return res.status(403).json({ message: "Invalid token" });
    }

    // 4. Success! Attach the user payload to the request object
    req.user = userPayload;

    // 5. Continue to the next middleware or the route handler
    next();
  });
};
