import type {Request, Response, NextFunction} from "express";
import passport from "passport";
import User from "../model/userModel.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userExists = await User.emailExists(email);
    if (userExists) {
      return res.status(400).json({ error: "Email already exists, please log in instead." });
    }
    const user: IUser = await User.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error, user: IUser | false, info?: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(401)
            .json({ message: info?.message || "Login failed" });
        }
        req.logIn(user, (err: Error | null) => {
          if (err) {
            return next(err);
          }
          return res
            .status(200)
            .json({ message: "Logged in successfully", user });
        });
      }
    )(req, res, next);
  }

  export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error | null) => {
      if (err) {
        return next(err);
      }
      //   Destroy session and clear cookie
      req.session.destroy((err: Error | null) => {
        if (err) {
          return next(err);
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
      });
    });
  }

  export const createProfile = async (req: Request, res: Response) => {
    if(!req.user){
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { username, displayName, bio, profilePictureUrl, paymentQrCodeUrl, socials, theme } = req.body;
    console.log({ username, displayName, bio, profilePictureUrl, paymentQrCodeUrl, socials, theme });
  }