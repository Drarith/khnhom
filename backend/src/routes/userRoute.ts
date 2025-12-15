import express from "express";
import {
  createUser,
  googleCallback,
  loginUser,
  logoutUser,
  deactivateAccountByUsername,
  reactivateAccountByUsername,
  getUserRole,
} from "../controllers/userController.js";
import passport from "passport";
import "../config/passport.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/api/create-user", createUser);

userRouter.post("/api/login", loginUser);

userRouter.get(
  "/api/auth/google",
  // scope specifies what data we want from the user
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get("/api/auth/google/callback", googleCallback);

userRouter.post("/api/logout", logoutUser);

// Admin route to deactivate account by username
userRouter.patch(
  "/api/admin/deactivate/:username",
  authenticateToken,
  requireAdmin,
  deactivateAccountByUsername
);

// Admin route to reactivate account by username
userRouter.patch(
  "/api/admin/reactivate/:username",
  authenticateToken,
  requireAdmin,
  reactivateAccountByUsername
);

// Get current user's role
userRouter.get("/api/user/role", authenticateToken, getUserRole);

export default userRouter;
