import express from "express";
import {
  createProfile,
  getProfileByUsername,
  createAndAddLinkToProfile,
  updateProfile,
  deleteLinkFromProfile,
  getProfileLinks,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";
import "../config/passport.js";

const profileRouter = express.Router();

profileRouter.post("/api/create-profile", authenticateToken, createProfile);

// use this path to update profile or delete profile data
profileRouter.put("/api/update-profile", authenticateToken, updateProfile);

profileRouter.delete(
  "/api/profile/links/:linkId",
  authenticateToken,
  deleteLinkFromProfile
);

profileRouter.get("/api/profile/:username", getProfileByUsername);

profileRouter.get("/api/profile/:username/links", getProfileLinks);

profileRouter.post(
  "/api/create-link",
  authenticateToken,
  createAndAddLinkToProfile
);

export default profileRouter;
