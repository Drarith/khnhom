import express from "express";
import { cloudinaryUploadSignature } from "../controllers/cloudinaryController.js";
import { authenticateToken } from "../middleware/auth.js";

const cloudinaryRouter = express.Router();

cloudinaryRouter.get(
  "/api/sign-upload",
  authenticateToken,
  cloudinaryUploadSignature
);

export default cloudinaryRouter;
