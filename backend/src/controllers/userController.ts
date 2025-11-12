import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import UserRole from "../model/roleModel.js";

import { sendAuthHttpOnlyCookie } from "../helpers/httpOnlyCookie.js";

import type { IUser } from "../model/types-for-models/userModel.types.js";

import { env } from "../config/myEnv.js";
import Profile from "../model/profileModel.js";

const JWT_SECRET = env.JWT_SECRET;
const secureCookie = env.NODE_ENV === "production";

// For when we implement user registration with email/password
export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userExists = await User.emailExists(email);
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Email already exists, please log in instead." });
    }
    const user: IUser = await User.createUser(email, password);
    const userData = {
      user: user._id,
    };
    await UserRole.createUserRole(userData);
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: "1d",
    });
    sendAuthHttpOnlyCookie(res, token, {
      statusCode: 201,
      message: "User created successfully.",
      secure: secureCookie,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to create user.", error: error });
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    // executing our strategy from passport config
    // this is the returned function
    (err: Error, user: IUser | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Login failed" });
      }
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: "1d",
      });

      sendAuthHttpOnlyCookie(res, token, {
        message: "Logged in successfully.",
        secure: secureCookie,
      });
    }
  )(
    // invoke the returned function immediately with req, res, next
    req,
    res,
    next
  );
};

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    // make callback async so we can await DB calls
    async (err: Error, user: IUser | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Authentication failed" });
      }

      try {
        const payload = {
          id: user._id,
          email: user.email,
        };
        const token = jwt.sign(payload, JWT_SECRET as string, {
          expiresIn: "1d",
        });


        const existingProfile = await Profile.findOne({ user: user._id });

        const base = env.FRONTEND_URL;
        const redirectTo = existingProfile
          ? `${base}/dashboard`
          : `${base}/create-profile`;

        sendAuthHttpOnlyCookie(res, token, {
          message: existingProfile
            ? "Google authentication successful."
            : "Google authentication successful. Please create your profile.",
          secure: secureCookie,
          redirectTo,
        });
      } catch (dbErr) {
        console.error("Profile lookup failed:", dbErr);
       
        return res.status(200).json({
          message:
            "Authenticated, but profile check failed. Please refresh or try again.",
        });
      }
    }
  )(req, res, next);
};

export const logoutUser = (_req: Request, res: Response) => {
  res
    .clearCookie("auth_token", {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out. Cookie cleared.",
    });
};
