import type { Response } from "express";
import type { CookieOptions } from "../types/helpers.js";
import { env } from "../config/myEnv.js";

// Helper to determine cookie domain
export const getCookieDomain = () => {
  try {
    if (!env.FRONTEND_URL) return undefined;
    const { hostname } = new URL(env.FRONTEND_URL);
    if (hostname === "localhost" || hostname === "127.0.0.1") return undefined;

    // Check if it's an IP address, don't prepend dot for IPs
    if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) return undefined;

    // Returns .khnhom.com for khnhom.com or api.khnhom.com
    return hostname.startsWith(".") ? hostname : `.${hostname}`;
  } catch (error) {
    return undefined;
  }
};

export const sendAuthHttpOnlyCookie = (
  res: Response,
  token: string,
  {
    name = "auth_token",
    message = "OK",
    statusCode = 200,
    maxAgeMs = 24 * 60 * 60 * 1000,
    secure = true,
    redirectTo,
  }: CookieOptions = {}
) => {
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite: secure ? ("none" as const) : ("lax" as const),
    maxAge: maxAgeMs,
    domain: secure ? getCookieDomain() : undefined,
  };

  res.cookie(name, token, cookieOptions);

  if (redirectTo) {
    return res.status(statusCode).redirect(redirectTo);
  }

  return res.status(statusCode).json({ message });
};

/**
 * Send both access token and refresh token as HTTP-only cookies
 */
export const sendAuthTokens = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  {
    message = "OK",
    statusCode = 200,
    secure = true,
    redirectTo,
  }: Omit<CookieOptions, "name" | "maxAgeMs"> = {}
) => {
  const domain = secure ? getCookieDomain() : undefined;

  // Access token - 15 minutes
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    domain,
    // this way jwt will expire in 15 minutes but cookie will be valid for 7 days we can refresh token within that time
    // jwt sign at tokenUtils.ts
    // maxAge: 3 * 1000, // 10 seconds test
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token - 7 days
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    // without path it was causing bug where we would only get old token
    // setting path we are telling the browser where to send this cookie
    path: "/api/auth/refresh-token",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Logged in flag - 7 days (visible to all paths, not httpOnly)
  res.cookie("logged_in", "true", {
    httpOnly: false,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (redirectTo) {
    return res.status(statusCode).redirect(redirectTo);
  }

  return res.status(statusCode).json({ message });
};

export const clearAuthCookies = (res: Response, secure: boolean = true) => {
  const domain = secure ? getCookieDomain() : undefined;
  const sameSite = secure ? "none" : "lax";

  res.clearCookie("access_token", {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    domain,
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure,
    sameSite,
    path: "/api/auth/refresh-token",
    domain,
  });

  res.clearCookie("logged_in", {
    httpOnly: false,
    secure,
    sameSite,
    path: "/",
    domain,
  });
};
