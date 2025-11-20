import express from "express";
import {
  createProfile,
  getProfileByUsername,
  createAndAddLinkToProfile,
  updateProfile,
  deleteLinkFromProfile,
  getProfileLinks,
  currentUserProfile,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";
import "../config/passport.js";
import { trackProfileView } from "../middleware/viewProfile.js";

const profileRouter = express.Router();

profileRouter.post("/api/create-profile", authenticateToken, createProfile);

// use this path to update profile or delete profile data
profileRouter.put("/api/update-profile", authenticateToken, updateProfile);

profileRouter.delete(
  "/api/profile/links/:linkId",
  authenticateToken,
  deleteLinkFromProfile
);

// move the more specific route before the generic :username route
profileRouter.get("/api/profile/:username/links", getProfileLinks);

profileRouter.get(
  "/api/profile/:username",
  trackProfileView,
  getProfileByUsername
);

profileRouter.post(
  "/api/create-link",
  authenticateToken,
  createAndAddLinkToProfile
);

profileRouter.get("/api/me", authenticateToken, currentUserProfile);

export default profileRouter;
