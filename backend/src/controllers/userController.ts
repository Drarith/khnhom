import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

import { sendAuthHttpOnlyCookie } from "../helpers/httpOnlyCookie.js";

import type { IUser } from "../model/types-for-models/userModel.types.js";

import { env } from "../config/myEnv.js";
import Profile from "../model/profileModel.js";
import UserRole from "../model/roleModel.js";

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

        // const doesRoleExist = await UserRole.findOne({ user: user._id });
        // if (!doesRoleExist) {
        //   try {
        //     await UserRole.createUserRole({ user: user._id });
        //   } catch (err) {
        //     throw err;
        //   }
        // }

        const existingProfile = await Profile.findOne({ user: user._id });

        const base = process.env.FRONTEND_URL;
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

export const deactivateAccountByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.isActive) {
      return res
        .status(400)
        .json({ message: "This profile is already deactivated" });
    }

    profile.isActive = false;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Profile ${username} has been deactivated successfully`,
    });
  } catch (error) {
    console.error("Error deactivating account:", error);
    return res.status(500).json({
      message: "Unable to deactivate account",
      error: error,
    });
  }
};

export const reactivateAccountByUsername = async (
  req: Request,
  res: Response
) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.isActive) {
      return res
        .status(400)
        .json({ message: "This profile is already active" });
    }

    profile.isActive = true;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: `Profile ${username} has been reactivated successfully`,
    });
  } catch (error) {
    console.error("Error reactivating account:", error);
    return res.status(500).json({
      message: "Unable to reactivate account",
      error: error,
    });
  }
};

export const getUserRole = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = (req.user as IUser).id;
    const userRole = await UserRole.findOne({ user: userId });

    if (!userRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json({ role: userRole.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
