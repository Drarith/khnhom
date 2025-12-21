import jwt from "jsonwebtoken";
import { env } from "../config/myEnv.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

const JWT_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET || JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface TokenPayload {
  id: string;
  email: string;
}

/**
 * Generate an access token (short-lived)
 * Default expiration: 15 minutes
 */
export const generateAccessToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate a refresh token (long-lived)
 * Default expiration: 7 days
 */
export const generateRefreshToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  // decode jwt.sign and verify the token using JWT_SECRET
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (user: IUser) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};
