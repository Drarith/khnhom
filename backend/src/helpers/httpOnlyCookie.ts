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
  }: CookieOptions = {}
) => {
  res
    .status(statusCode)
    .cookie(name, token, {
      httpOnly: true,
      secure: secure,
      sameSite: "lax",
      maxAge: maxAgeMs,
    })
    .json({ message });
};
