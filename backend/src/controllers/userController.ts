import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import UserRole from "../model/roleModel.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

import { env } from "../config/myEnv.js";

const JWT_SECRET = env.JWT_SECRET;

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
    res.status(201).json({ user: user, token: token });
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

      return res
        .status(200)
        .json({ message: "Logged in successfully.", token: token });
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
    (err: Error, user: IUser | false, info?: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Authentication failed" });
      }
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: "1d",
      });
      return res.json({ token: token });
    }
  )(req, res, next);
};

export const logoutUser = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message:
      "Successfully logged out. Please remove the token from your client.",
  });
};
