import express from "express";
import {
  createProfile,
  getProfileByUsername,
  createAndAddLinkToProfile,
  updateProfile
} from "../controllers/profileController.js";
import { getProfileLinks } from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";
import "../config/passport.js";

const profileRouter = express.Router();

profileRouter.post("/api/create-profile", authenticateToken, createProfile);

profileRouter.put("/api/update-profile", authenticateToken, updateProfile);

profileRouter.get("/api/profile/:username", getProfileByUsername);

profileRouter.get("/api/profile/:username/links", getProfileLinks);

profileRouter.post(
  "/api/create-link",
  authenticateToken,
  createAndAddLinkToProfile
);

export default profileRouter;
