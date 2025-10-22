import express from "express";
import {

  createUser,

  loginUser,
  logoutUser,

} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import passport from "passport";
import "../config/passport.js";

const userRouter = express.Router();

userRouter.post("/api/create-user", createUser);


userRouter.post("/api/login", loginUser);

userRouter.get(
  "/api/auth/google",
  // scope specifies what data we want from the user
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

userRouter.get("/api/logout", logoutUser);

export default userRouter;
