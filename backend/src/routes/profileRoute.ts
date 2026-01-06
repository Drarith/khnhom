import express from "express";
import {
  createProfile,
  getProfileByUsername,
  createAndAddLinkToProfile,
  updateProfile,
  deleteLinkFromProfile,
  getProfileLinks,
  currentUserProfile,
  updateProfilePictureUrl,
  toggleStatus,
  getPublicProfiles,
} from "../controllers/profileController.js";
import {
  createKHQR,
  createKHQRForDonation,
  paymentEventsHandler,
} from "../controllers/khqrController.js";
import { authenticateToken } from "../middleware/auth.js";
import "../config/passport.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const profileRouter = express.Router();

// Public endpoint for sitemap (no auth required)
profileRouter.get("/profiles/public", getPublicProfiles);

profileRouter.patch(
  "/api/user/toggle-status",
  authenticateToken,
  requireAdmin,
  toggleStatus
);

profileRouter.post(
  "/api/user/generate-donation-khqr",
  authenticateToken,
  createKHQRForDonation
);

profileRouter.post("/api/create-profile", authenticateToken, createProfile);

profileRouter.get("/api/payment/events/:md5", paymentEventsHandler);

profileRouter.post(
  "/api/create-link",
  authenticateToken,
  createAndAddLinkToProfile
);

profileRouter.post("/api/khqr", authenticateToken, createKHQR);

profileRouter.patch(
  "/api/profile/picture",
  authenticateToken,
  updateProfilePictureUrl
);

// use this path to update profile or delete profile data
profileRouter.put("/api/update-profile", authenticateToken, updateProfile);

profileRouter.delete(
  "/api/profile/links/:linkId",
  authenticateToken,
  deleteLinkFromProfile
);

// move the more specific route before the generic :username route
profileRouter.get("/api/profile/:username/links", getProfileLinks);

profileRouter.get("/api/me", authenticateToken, currentUserProfile);

profileRouter.get("/api/:username", getProfileByUsername);

export default profileRouter;
