import type { Response } from "express";
import type { CookieOptions } from "../types/helpers.js";

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
    sameSite: "lax" as const,
    maxAge: maxAgeMs,
  };

  res.cookie(name, token, cookieOptions);

  if (redirectTo) {
    return res.status(statusCode).redirect(redirectTo);
  }

  return res.status(statusCode).json({ message });
};
