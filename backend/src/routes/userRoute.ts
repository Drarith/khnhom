import express from "express";
import type { Request, Response, NextFunction } from "express";
import { createUser } from "../controllers/userController.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import passport from "passport";
import "../config/passport.js";

const userRouter = express.Router();

userRouter.post("/api/create-user", createUser);

userRouter.post(
  "/api/login",
  (req: Request, res: Response, next: NextFunction) => {
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
);

userRouter.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/api/logout",
  (req: Request, res: Response, next: NextFunction) => {
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
);

export default userRouter;
